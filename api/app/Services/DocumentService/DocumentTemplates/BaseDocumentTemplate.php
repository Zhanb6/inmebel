<?php

namespace App\Services\DocumentService\DocumentTemplates;

use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\TemplateProcessor;


abstract class BaseDocumentTemplate
{


    abstract protected function templatePath(): string;
    abstract protected function generate();
    abstract protected function data():array;


    public function getTemplate():TemplateProcessor
    {
        $templateProcessor = new TemplateProcessor($this->templatePath());

        foreach ($this->data() as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        return $templateProcessor;
    }

    public function contractNumberPrefix()
    {
        return 'INM';
    }
}
