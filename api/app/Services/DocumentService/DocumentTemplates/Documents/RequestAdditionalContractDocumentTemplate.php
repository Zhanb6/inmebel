<?php

namespace App\Services\DocumentService\DocumentTemplates\Documents;

use App\Models\RequestAddition;
use App\Models\RequestModel;
use App\Services\DocumentService\DocumentTemplates\BaseDocumentTemplate;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class RequestAdditionalContractDocumentTemplate extends BaseDocumentTemplate
{
    public $requestModel;
    public function __construct(public RequestAddition $requestAddition)
    {
        $this->requestModel = $requestAddition->request_model;
    }

    protected function templatePath(): string
    {
        return Storage::disk('local')->path('templates/requestAdditionalContract.docx');
    }

    public function generate()
    {
        $requestModel = $this->requestModel;
        $template = $this->getTemplate();

        if (!Storage::disk('local')->exists('temporary')){
            Storage::disk('local')->makeDirectory('temporary');
        }

        $path = Storage::disk('local')->path("temporary/Доп соглашение № {$this->requestAddition->number} Договор № ".$this->contractNumberPrefix().format_id($requestModel->id).'.docx');

        $template->saveAs($path);

        return $path;
    }

    protected function data(): array
    {
        $requestModel = $this->requestModel;


        $now = Carbon::now()->locale('kk_KZ');

        $addons = $requestModel->furniture_data?->addons?->map(function($addon){
            return $addon->addon_data?->furniture_addon?->name.' кол-во '.$addon->addon_data?->count;
        })?->implode(', ');

        $contractDate = Carbon::parse($requestModel->request_contract_date);
        $data = [
            'contract_number'=>$this->contractNumberPrefix().format_id($requestModel->id),
            'contract_day'=>$contractDate->format('d'),
            'contract_month'=>$contractDate->format('m'),
            'contract_year'=>$contractDate->format('Y'),
            'additional_number'=>$this->requestAddition->number,
            'day'=>$now->format('d'),
//            'month'=>$now->translatedFormat('F'),
            'month'=>$now->format('m'),
            'year'=>$now->format('Y'),

            'workshop_bin'=>$requestModel->workshop->iin,
            'workshop_name'=>$requestModel->workshop->name,
            'workshop_address'=>$requestModel->workshop->address,
            'workshop_director_name'=>$requestModel->workshop->director_name,
            'workshop_user_name'=>$requestModel->workshop->name,
            'workshop_iic'=>$requestModel->workshop->iic,
            'workshop_bank'=>$requestModel->workshop->bank,
            'workshop_bic'=>$requestModel->workshop->bic,
            'workshop_bc'=>$requestModel->workshop->bc,
            'workshop_city'=>$requestModel->workshop->city,

            'furniture_name'=>$requestModel->furniture_type?->name,
            'furniture_count'=>1,
            'furniture_price'=>$requestModel->price,
            'furniture_frame'=>$requestModel->furniture_data?->frame?->name ?? '',
            'furniture_brand'=>$requestModel->furniture_data?->brand?->name ?? '',
            'furniture_facade'=>$requestModel->furniture_data?->facade?->name ?? '',
            'furniture_tabletop'=>$requestModel->furniture_data?->kitchen_tabletop?->name ?? '',
            'furniture_addons'=>$addons ?? '',

            'client_name'=>$requestModel->client_name ?? '',
            'client_iin'=>$requestModel->client_iin ?? '',
            'client_phone'=>$requestModel->client_phone ?? '',
            'client_address'=>$requestModel->client_address ?? '',
        ];



        return $data;
    }
}
