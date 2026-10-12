<?php

namespace App\Services\DocumentService;

use App\Models\Media;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PDO;
use Spatie\MediaLibrary\Support\PathGenerator\PathGeneratorFactory;
use Spatie\MediaLibrary\Support\UrlGenerator\UrlGeneratorFactory;

class DocumentSignService
{
    public static function signMedia(Request $request,Media $media,User $user,$phone,$phone_code,$mode = 'client')
    {

        $pdo = DB::connection()->getPdo();

        $fp = fopen($media->getPath(), 'rb'); // бинарный ресурс файла

        $stmt = $pdo->prepare('
    INSERT INTO signed_media
    (media_id,user_id, user_phone, user_name, user_iin, signed_phone, signed_phone_code, ip_address, user_agent, file_hash, file_hash_method, file, file_name, file_mime_type,created_at,updated_at)
    VALUES
    (:media_id,:user_id, :user_phone, :user_name, :user_iin, :signed_phone, :signed_phone_code, :ip_address, :user_agent, :file_hash, :file_hash_method, :file, :file_name, :file_mime_type,:created_at,:updated_at)
');

        switch ($mode) {
            case 'client':
                $stmt->bindValue(':user_iin', $user->client_data?->iin);
                break;
            case 'workshop':

                $stmt->bindValue(':user_iin', $user->workshop?->iin);
                break;
        }

        $stmt->bindValue(':media_id', $media->id);
        $stmt->bindValue(':user_id', $user->id);
        $stmt->bindValue(':user_phone', $user->phone);
        $stmt->bindValue(':user_name', $user->name);

        $stmt->bindValue(':signed_phone', $phone);
        $stmt->bindValue(':signed_phone_code', $phone_code);
        $stmt->bindValue(':ip_address', $request->getClientIp());
        $stmt->bindValue(':user_agent', $request->userAgent());
        $stmt->bindValue(':file_hash', hash_file('sha256', $media->getPath()));
        $stmt->bindValue(':file_hash_method', 'sha256');

        // здесь бинарный ресурс вставляем через PARAM_LOB
        $stmt->bindParam(':file', $fp, PDO::PARAM_LOB);

        $stmt->bindValue(':file_name', $media->file_name);
        $stmt->bindValue(':file_mime_type', $media->mime_type);
        $stmt->bindValue(':created_at', now()->format('Y-m-d H:i:s'));
        $stmt->bindValue(':updated_at', now()->format('Y-m-d H:i:s'));

        $stmt->execute();
//        fclose($fp);

        return true;

    }
}
