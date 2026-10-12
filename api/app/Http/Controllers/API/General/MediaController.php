<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\DocumentService\DocumentTemplates\Documents\MediaSignDocumentTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;


class MediaController extends Controller
{
    public function downloadMedia(Request $request,$uuid){
        $media = Media::findByUuid($uuid) ?? throw ValidationException::withMessages([
            'uuid' => 'Media not found!',
        ]);


        check_access('view',$media);

        return response()->download($media->getPath(), $media->file_name);
    }

    public function downloadSignature(Request $request,$uuid)
    {

        $media = Media::findByUuid($uuid) ?? throw ValidationException::withMessages([
            'uuid' => 'Media not found!',
        ]);


        check_access('view',$media);
        $generator = new MediaSignDocumentTemplate($media);

        $path = $generator->generate();

        $mimeType = Storage::disk('local')->mimeType($path);

        return response()->download($path, $mimeType);
    }
}
