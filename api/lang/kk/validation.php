<?php

return [

    /*
     |--------------------------------------------------------------------------
     | Мәндерді тексеруге арналған тілдік ресурстар
     |--------------------------------------------------------------------------
     |
     | Келесі тілдік жолдар мәндерді тексеру сыныбымен (валидатор) пайдаланылатын
     | әдепкі хабарламаларды қамтиды. Кейбір ережелер бірнеше нұсқаларға ие,
     | мысалы, size. Сіз оларды қосымшаңызға сәйкес өзгерте аласыз.
     |
     */

    'accepted' => ':attribute қабылдануы қажет.',
    'accepted_if' => ':attribute :other :value болса, қабылдануы қажет.',
    'active_url' => ':attribute жарамды URL мекенжайы болуы қажет.',
    'after' => ':attribute :date күнінен кейінгі күн болуы қажет.',
    'after_or_equal' => ':attribute :date күнінен кейінгі немесе тең күн болуы қажет.',
    'alpha' => ':attribute тек әріптерден тұруы қажет.',
    'alpha_dash' => ':attribute тек әріптерден, сандардан, сызықшалар мен астын сызудан тұруы қажет.',
    'alpha_num' => ':attribute тек әріптер мен сандардан тұруы қажет.',
    'array' => ':attribute массив болуы қажет.',
    'ascii' => ':attribute тек ASCII таңбаларынан тұруы қажет.',
    'before' => ':attribute :date күнінен бұрынғы күн болуы қажет.',
    'before_or_equal' => ':attribute :date күнінен бұрынғы немесе тең күн болуы қажет.',
    'between' => [
        'array' => ':attribute :min және :max элементтер аралығында болуы қажет.',
        'file' => ':attribute :min және :max килобайт арасында болуы қажет.',
        'numeric' => ':attribute :min және :max арасында болуы қажет.',
        'string' => ':attribute :min және :max таңбалар арасында болуы қажет.',
    ],
    'boolean' => ':attribute мәні true немесе false болуы қажет.',
    'confirmed' => ':attribute растауы сәйкес келмейді.',
    'current_password' => 'Қате құпиясөз.',
    'date' => ':attribute жарамды күн болуы қажет.',
    'date_equals' => ':attribute :date күнімен тең болуы қажет.',
    'date_format' => ':attribute :format форматына сәйкес келуі қажет.',
    'decimal' => ':attribute :decimal ондық белгіге ие болуы қажет.',
    'declined' => ':attribute қабылданбауы қажет.',
    'declined_if' => ':attribute :other :value болса, қабылданбауы қажет.',
    'different' => ':attribute және :other әртүрлі болуы қажет.',
    'digits' => ':attribute :digits цифрдан тұруы қажет.',
    'digits_between' => ':attribute :min және :max цифрлар арасында болуы қажет.',
    'dimensions' => ':attribute сурет өлшемдері дұрыс емес.',
    'distinct' => ':attribute қайталанатын мәнге ие.',
    'doesnt_end_with' => ':attribute келесі мәндердің бірімен аяқталмауы қажет: :values.',
    'doesnt_start_with' => ':attribute келесі мәндердің бірімен басталмауы қажет: :values.',
    'email' => ':attribute жарамды электрондық пошта болуы қажет.',
    'ends_with' => ':attribute келесі мәндердің бірімен аяқталуы қажет: :values.',
    'enum' => ':attribute мәні жарамсыз.',
    'exists' => 'Таңдалған :attribute жарамсыз.',
    'file' => ':attribute файл болуы қажет.',
    'filled' => ':attribute толтырылуы қажет.',
    'gt' => [
        'array' => ':attribute элементтері :value санынан көп болуы қажет.',
        'file' => ':attribute :value килобайттан үлкен болуы қажет.',
        'numeric' => ':attribute :value санынан үлкен болуы қажет.',
        'string' => ':attribute :value таңбалардан көп болуы қажет.',
    ],
    'gte' => [
        'array' => ':attribute :value немесе одан көп элементтерден тұруы қажет.',
        'file' => ':attribute :value килобайттан үлкен немесе тең болуы қажет.',
        'numeric' => ':attribute :value санынан үлкен немесе тең болуы қажет.',
        'string' => ':attribute :value таңбалардан көп немесе тең болуы қажет.',
    ],
    'image' => ':attribute сурет болуы қажет.',
    'in' => 'Таңдалған :attribute жарамсыз.',
    'in_array' => ':attribute :other ішінде болуы қажет.',
    'integer' => ':attribute бүтін сан болуы қажет.',
    'ip' => ':attribute жарамды IP мекенжайы болуы қажет.',
    'ipv4' => ':attribute жарамды IPv4 мекенжайы болуы қажет.',
    'ipv6' => ':attribute жарамды IPv6 мекенжайы болуы қажет.',
    'json' => ':attribute жарамды JSON жолы болуы қажет.',
    'lowercase' => ':attribute тек кіші әріптерден тұруы қажет.',
    'lt' => [
        'array' => ':attribute :value элементтерінен аз болуы қажет.',
        'file' => ':attribute :value килобайттан аз болуы қажет.',
        'numeric' => ':attribute :value санынан аз болуы қажет.',
        'string' => ':attribute :value таңбалардан аз болуы қажет.',
    ],
    'lte' => [
        'array' => ':attribute :value элементтерінен аспауы қажет.',
        'file' => ':attribute :value килобайттан аз немесе тең болуы қажет.',
        'numeric' => ':attribute :value санынан аз немесе тең болуы қажет.',
        'string' => ':attribute :value таңбалардан аз немесе тең болуы қажет.',
    ],
    'mac_address' => ':attribute жарамды MAC мекенжайы болуы қажет.',
    'max' => [
        'array' => ':attribute :max элементтерден көп болмауы қажет.',
        'file' => ':attribute :max килобайттан аспауы қажет.',
        'numeric' => ':attribute :max санынан көп болмауы қажет.',
        'string' => ':attribute :max таңбалардан аспауы қажет.',
    ],
    'max_digits' => ':attribute :max цифрдан аспауы қажет.',
    'mimes' => ':attribute келесі файл типтерінің бірі болуы қажет: :values.',
    'mimetypes' => ':attribute келесі файл типтерінің бірі болуы қажет: :values.',
    'min' => [
        'array' => ':attribute кемінде :min элементтерден тұруы қажет.',
        'file' => ':attribute кемінде :min килобайт болуы қажет.',
        'numeric' => ':attribute кемінде :min болуы қажет.',
        'string' => ':attribute кемінде :min таңбалардан тұруы қажет.',
    ],
    'min_digits' => ':attribute кемінде :min цифр болуы қажет.',
    'missing' => ':attribute жоқ болуы қажет.',
    'missing_if' => ':attribute :other :value болғанда жоқ болуы қажет.',
    'missing_unless' => ':attribute :other :value болмаған жағдайда жоқ болуы қажет.',
    'missing_with' => ':attribute :values болғанда жоқ болуы қажет.',
    'missing_with_all' => ':attribute :values болғанда жоқ болуы қажет.',
    'multiple_of' => ':attribute :value еселі болуы қажет.',
    'not_in' => 'Таңдалған :attribute жарамсыз.',
    'not_regex' => ':attribute форматы жарамсыз.',
    'numeric' => ':attribute сан болуы қажет.',
    'password' => [
        'letters' => ':attribute кемінде бір әріптен тұруы қажет.',
        'mixed' => ':attribute кемінде бір бас әріп және бір кіші әріптен тұруы қажет.',
        'numbers' => ':attribute кемінде бір цифрдан тұруы қажет.',
        'symbols' => ':attribute кемінде бір символдан тұруы қажет.',
        'uncompromised' => 'Көрсетілген :attribute мәліметтер жария етілген. Басқа :attribute таңдаңыз.',
    ],
    'present' => ':attribute қатысуы қажет.',
    'prohibited' => ':attribute тыйым салынған.',
    'prohibited_if' => ':attribute :other :value болғанда тыйым салынған.',
    'prohibited_unless' => ':attribute :other :values болмаса, тыйым салынған.',
    'prohibits' => ':attribute :other қатысуына тыйым салады.',
    'regex' => ':attribute форматы жарамсыз.',
    'required' => ':attribute міндетті болып табылады.',
    'required_array_keys' => ':attribute келесі жазбалардан тұруы қажет: :values.',
    'required_if' => ':attribute :other :value болғанда міндетті.',
    'required_if_accepted' => ':attribute :other қабылданғанда міндетті.',
    'required_unless' => ':attribute :other :values болмаса, міндетті.',
    'required_with' => ':attribute :values болғанда міндетті.',
    'required_with_all' => ':attribute :values болғанда міндетті.',
    'required_without' => ':attribute :values болмаған кезде міндетті.',
    'required_without_all' => ':attribute :values ешқайсысы болмаған кезде міндетті.',
    'same' => ':attribute және :other сәйкес болуы қажет.',
    'size' => [
        'array' => ':attribute :size элементтерден тұруы қажет.',
        'file' => ':attribute :size килобайт болуы қажет.',
        'numeric' => ':attribute :size болуы қажет.',
        'string' => ':attribute :size таңбалардан тұруы қажет.',
    ],
    'starts_with' => ':attribute келесі мәндердің бірімен басталуы қажет: :values.',
    'string' => ':attribute жол болуы қажет.',
    'timezone' => ':attribute жарамды уақыт аймағы болуы қажет.',
    'unique' => ':attribute мәні бұрыннан бар.',
    'uploaded' => ':attribute жүктеу сәтсіз аяқталды.',
    'uppercase' => ':attribute тек бас әріптерден тұруы қажет.',
    'url' => ':attribute жарамды URL болуы қажет.',
    'ulid' => ':attribute жарамды ULID болуы қажет.',
    'uuid' => ':attribute жарамды UUID болуы қажет.',
    'owner_micro_market' => ':attribute микромаркет иесі болуы қажет',
    'franchisee' => ':attribute Franchisee рөліне ие болуы қажет',
    'franchisee_stock' => ':attribute франшизадан болуы қажет',
    'franchisee_own' => ':attribute франшизадан болуы қажет',
    'percent_less' => ':attribute 100-ден аз болуы қажет',
    'discount_type_required' => 'discount_type қажет',
    'orderBy' => ':attribute DESC немесе ASC болуы қажет',

    /*
     |--------------------------------------------------------------------------
     | Пайдаланушы анықтамалары
     |--------------------------------------------------------------------------
     |
     | Бұл бөлімде тексеру ережелерінің атауына қатысты ерекше хабарламаларды
     | көрсету үшін анықтамалар келтірілген.
     |
     */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
     |--------------------------------------------------------------------------
     | Атрибутты анықтау
     |--------------------------------------------------------------------------
     |
     | Төмендегі мәтіндер атрибуттың стандартты атауын қолданушыға түсінікті
     | сөзбен алмастыру үшін пайдаланылады.
     |
     */

    'attributes' => [],

];
