<?php

namespace App\Providers;

use App\Enums\PersonTypeEnum;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;

class RelationServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {

    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $map = [];

        foreach (File::allFiles(app_path('Models')) as $file) {
            $class = 'App\\Models\\' . $file->getFilenameWithoutExtension();

            if (class_exists($class)) {
                $model = new $class;

                if (method_exists($model, 'getTable')) {
                    $map[$model->getTable()] = $class;
                }
            }
        }

        Relation::enforceMorphMap($map);
    }
}
