<?php

namespace App\Services\DocumentService\DocumentTemplates\Documents;

use App\Models\Media;
use App\Models\RequestModel;
use App\Services\DocumentService\DocumentTemplates\BaseDocumentTemplate;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class MediaSignDocumentTemplate extends BaseDocumentTemplate
{
    public function __construct(public Media $media)
    {

    }

    protected function templatePath(): string
    {
        return Storage::disk('local')->path('templates/sign.docx');
    }

    public function generate()
    {

        $template = $this->getTemplate();

        $signatures = $this->media?->signatures;

        if (!Storage::disk('local')->exists('temporary')){
            Storage::disk('local')->makeDirectory('temporary');
        }

        $path = Storage::disk('local')->path("temporary/Подписи документа {$this->media?->file_name} .docx");

        $i = 1;

        $signs = $signatures->map(function ($signature) use (&$i) {

            $signature->key = $i;
            $signature->file = null;
            $signature->created_at = $signature->created_at?->format('d.m.Y H:i') ?? '';
            $i++;
            return $signature;
        })->toArray();


        $template->cloneBlock('signs', 0, true, false, $signs);


        $template->saveAs($path);

        return $path;
    }

    protected function data(): array
    {

        $data = [
            'file_name' => $this->media->file_name,
        ];


        return $data;
    }
}
