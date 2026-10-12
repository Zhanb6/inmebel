import { Controller } from "react-hook-form";
import { LabeledInput } from "@/shared/components";
import SelectField from "@/shared/components/form/SelectField";
import { useFormFilters } from "@/features/client/hooks/useFormFilters";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Step1FormProps {
  control: any;
  errors: any;
  dictionaries: any;
  furniture_type_id: any;
  furniture_subtype_id: any;
  setSelectedFurnitureId: (id: number | null) => void;
}

export function Step1Form({
  control,
  errors,
  dictionaries,
  furniture_type_id,
  furniture_subtype_id,
  setSelectedFurnitureId,
}: Step1FormProps) {
  const { filteredSubtypes, showHeightField } = useFormFilters({
    dictionaries,
    furniture_type_id,
    facade_id: undefined,
  });

  // Определяем, какие дополнительные поля показывать
  const showAdditionalFields = furniture_type_id && furniture_subtype_id;

  // Определяем, нужно ли показывать основное поле length
  // Для шкафов (type_id = 2) показываем length
  const allowedTypeSubtypePairs = [
    { type: 1, subtype: 1 },
    { type: 2, subtype: 5 },
    { type: 2, subtype: 6 },
    { type: 3 },
    { type: 4, subtype: 7 },
    { type: 4, subtype: 8 },
    { type: 4, subtype: 9 },
    { type: 5 },
    // Для добавления новых:
    // { type: 2, subtype: 3 },
    // { type: 3, subtype: [4, 5] }, // если несколько подтипов
  ];

  const showMainLength = allowedTypeSubtypePairs.some((pair) => {
    if (Array.isArray(pair.subtype)) {
      return (
        furniture_type_id === pair.type &&
        pair.subtype.includes(furniture_subtype_id)
      );
    }
    return (
      furniture_type_id === pair.type && furniture_subtype_id === pair.subtype
    );
  });

  // Определяем, нужно ли показывать основное поле height
  // Для шкафов показываем height, для type_id = 4 - нет

  const unShowMainHeight = furniture_type_id === 1;

  // const params = ["Высота", "Ширина", "Глубина"];
  // const values = {
  //   Высота: [84, 83, 82, 81, 80],
  //   Ширина: [84, 83, 82, 81, 80],
  //   Глубина: [84, 83, 82, 81, 80],
  // };

  // const [activeParam, setActiveParam] = useState("Ширина");
  // const [activeValue, setActiveValue] = useState(82);

  // const scrollRef = useRef<HTMLDivElement | null>(null);

  // const currentValues = values[activeParam];

  // const scrollToValue = (value: number) => {
  //   const idx = currentValues.indexOf(value);
  //   if (idx < 0 || !scrollRef.current) return;

  //   const itemHeight = 26;
  //   scrollRef.current.scrollTo({
  //     top: idx * itemHeight,
  //     behavior: "smooth",
  //   });
  // };

  // const onScroll = () => {
  //   if (!scrollRef.current) return;
  //   const itemHeight = 26;

  //   const scrollTop = scrollRef.current.scrollTop;
  //   const idx = Math.round(scrollTop / itemHeight);

  //   const clampedIdx = Math.min(Math.max(idx, 0), currentValues.length - 1);
  //   setActiveValue(currentValues[clampedIdx]);
  // };

  // useEffect(() => {
  //   scrollToValue(activeValue);
  // }, [activeParam]);

  return (
    <div className="w-full space-y-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
          <h2 className="text-[18px] font-semibold mb-3">Pазмеры</h2>

          <div className="flex gap-16 justify-center">
            
            <div className="flex flex-col gap-2">
              {params.map((p) => (
                <div key={p} className="flex gap-1">
                 
                  <button
                    type="button"
                    onClick={() => setActiveParam(p)}
                    className={`text-left ${
                      activeParam === p
                        ? "text-[20px] font-bold text-[#13220f]"
                        : "text-[16px] text-[#bdc0bc]"
                    }`}
                  >
                    {p}
                  </button>

                  
                  {activeParam !== p && p === "Высота" && (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-[2px] text-[12px] bg-[#E8FADf] text-[#63C05B] rounded-full">
                        {activeValue} см
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

           
            <div className="flex items-center gap-2">
              <div className="relative h-[80px] overflow-hidden">
                <div
                  ref={scrollRef}
                  onScroll={onScroll}
                  className="h-full w-20 overflow-y-scroll no-scrollbar snap-y snap-mandatory"
                >
                  {currentValues.map((v) => (
                    <div
                      key={v}
                      onClick={() => {
                        setActiveValue(v);
                        scrollToValue(v);
                      }}
                      className={`h-[26px] text-[20px] flex items-center cursor-pointer transition-all ${
                        v === activeValue
                          ? "text-[#63C05B] font-semibold"
                          : "text-[#13220f]"
                      }`}
                    >
                      {v} см
                    </div>
                  ))}
                </div>

                
                <div className="pointer-events-none absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-white to-transparent" />
                <div className="pointer-events-none absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-white to-transparent" />
              </div>
            </div>
          </div>
        </div> */}

        <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
          {/* Тип мебели */}
          <div>
            <h3 className="text-[18px] font-semibold mb-3">Тип мебели</h3>

            <Controller
              control={control}
              name="furniture_type_id"
              render={({ field }) => (
                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex gap-2 w-max">
                    {dictionaries.furnitureTypes &&
                    dictionaries.furnitureTypes.length > 0 ? (
                      dictionaries.furnitureTypes.map((item: any) => {
                        const isActive = field.value === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              field.onChange(item.id);
                              setSelectedFurnitureId(item.id);
                            }}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition ${
                              isActive
                                ? "border border-[#4CAF50] text-black bg-white"
                                : "bg-[#f2f2f2] text-[#bfbfbf]"
                            }`}
                          >
                            {item.name}
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-center py-3 text-gray-400">
                        Нет доступных типов мебели
                      </div>
                    )}
                  </div>
                </div>
              )}
            />

            {errors.furniture_type_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.furniture_type_id.message}
              </p>
            )}
          </div>

          {/* Подтип мебели */}
          <div>
            <h3 className="text-[18px] font-semibold mb-3">Выберите форму</h3>

            <Controller
              control={control}
              name="furniture_subtype_id"
              render={({ field }) => {
                // Находим выбранный тип мебели
                const selectedType = dictionaries.furnitureTypes?.find(
                  (type: any) => type.id === furniture_type_id,
                );

                // Получаем подтипы для выбранного типа
                const availableSubtypes = selectedType?.subtypes || [];

                return (
                  <>
                    {availableSubtypes.length > 0 ? (
                      <div className="overflow-x-auto no-scrollbar">
                        <div className="flex gap-2 w-max">
                          {availableSubtypes.map((subtype: any) => {
                            const isActive = field.value === subtype.id;

                            return (
                              <button
                                key={subtype.id}
                                type="button"
                                onClick={() => field.onChange(subtype.id)}
                                disabled={!furniture_type_id}
                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition ${
                                  isActive
                                    ? "border border-[#4CAF50] text-black bg-white"
                                    : "bg-[#f2f2f2] text-[#bfbfbf]"
                                } ${!furniture_type_id ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                {subtype.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3 text-gray-400">
                        {furniture_type_id
                          ? "Нет доступных подтипов для выбранного типа"
                          : "Сначала выберите тип мебели"}
                      </div>
                    )}
                  </>
                );
              }}
            />

            {errors.furniture_subtype_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.furniture_subtype_id.message}
              </p>
            )}
          </div>
        </div>

        <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4 mb-16">
          <div className="flex flex-col">
            <label className="font-normal text-[12px] mb-2">Параметры</label>
            <div className="flex gap-2.5 flex-col">
              {/* Основная длина (всегда показываем) */}
              {showMainLength && (
                <Controller
                  control={control}
                  name="length"
                  render={({ field }) => (
                    <LabeledInput
                      name="length"
                      placeholder="Длина"
                      type="number"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value
                          ? Number(e.target.value)
                          : undefined;
                        field.onChange(value);
                      }}
                      error={errors.length?.message}
                      // disabled={
                      //   !furniture_type_id ||
                      //   (furniture_type_id !== 3 &&
                      //     furniture_type_id !== 5 &&
                      //     !furniture_subtype_id) ||
                      //   !showHeightField
                      // }
                    />
                  )}
                />
              )}

              {/* Основная высота (показываем для всех, кроме type_id = 4) */}
              {!unShowMainHeight && (
                <Controller
                  control={control}
                  name="height"
                  render={({ field }) => (
                    <LabeledInput
                      name="height"
                      placeholder="Высота"
                      type="number"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value
                          ? Number(e.target.value)
                          : undefined;
                        field.onChange(value);
                      }}
                      error={errors.height?.message}
                      disabled={
                        !furniture_type_id ||
                        (furniture_type_id !== 3 &&
                          furniture_type_id !== 5 &&
                          !furniture_subtype_id) ||
                        !showHeightField
                      }
                    />
                  )}
                />
              )}

              {/* Поля для кухни (type_id = 1) */}
              {furniture_type_id === 1 && furniture_subtype_id === 2 && (
                <>
                  <Controller
                    control={control}
                    name="subtype_data.length_first"
                    render={({ field }) => (
                      <LabeledInput
                        name="length_first"
                        placeholder="Длина первой секции"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.length_first?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="subtype_data.length_second"
                    render={({ field }) => (
                      <LabeledInput
                        name="length_second"
                        placeholder="Длина второй секции"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.length_second?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                </>
              )}

              {furniture_type_id === 1 && furniture_subtype_id === 3 && (
                <>
                  <Controller
                    control={control}
                    name="subtype_data.length_first"
                    render={({ field }) => (
                      <LabeledInput
                        name="length_first"
                        placeholder="Длина первой секции"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.length_first?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="subtype_data.length_second"
                    render={({ field }) => (
                      <LabeledInput
                        name="length_second"
                        placeholder="Длина второй секции"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.length_second?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="subtype_data.length_third"
                    render={({ field }) => (
                      <LabeledInput
                        name="length_third"
                        placeholder="Длина третьей секции"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.length_third?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                </>
              )}

              {furniture_type_id === 1 && furniture_subtype_id === 4 && (
                <Controller
                  control={control}
                  name="subtype_data.length"
                  render={({ field }) => (
                    <LabeledInput
                      name="subtype_length"
                      placeholder="Длина секции"
                      type="number"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value
                          ? Number(e.target.value)
                          : undefined;
                        field.onChange(value);
                      }}
                      error={errors.subtype_data?.length?.message}
                      disabled={!showAdditionalFields}
                    />
                  )}
                />
              )}

              {/* Поля для шкафов (type_id = 2) */}
              {furniture_type_id === 2 &&
                (furniture_subtype_id === 5 || furniture_subtype_id === 6) && (
                  <Controller
                    control={control}
                    name="subtype_data.count_door"
                    render={({ field }) => (
                      <LabeledInput
                        name="count_door"
                        placeholder="Количество дверей"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.count_door?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                )}

              {/* Поля для type_id = 4 */}
              {furniture_type_id === 4 && furniture_subtype_id === 7 && (
                <>
                  <Controller
                    control={control}
                    name="subtype_data.length"
                    render={({ field }) => (
                      <LabeledInput
                        name="subtype_length"
                        placeholder="Длина"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.length?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="subtype_data.height"
                    render={({ field }) => (
                      <LabeledInput
                        name="height_subtype"
                        placeholder="Высота"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.height?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                </>
              )}

              {furniture_type_id === 4 && furniture_subtype_id === 8 && (
                <>
                  <Controller
                    control={control}
                    name="subtype_data.length_first"
                    render={({ field }) => (
                      <LabeledInput
                        name="length_first"
                        placeholder="Длина первой части"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.length_first?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="subtype_data.length_second"
                    render={({ field }) => (
                      <LabeledInput
                        name="length_second"
                        placeholder="Длина второй части"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.length_second?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="subtype_data.height"
                    render={({ field }) => (
                      <LabeledInput
                        name="height_subtype"
                        placeholder="Высота"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.height?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                </>
              )}

              {furniture_type_id === 4 && furniture_subtype_id === 9 && (
                <>
                  <Controller
                    control={control}
                    name="subtype_data.height"
                    render={({ field }) => (
                      <LabeledInput
                        name="height_subtype"
                        placeholder="Высота"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.height?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="subtype_data.length_first"
                    render={({ field }) => (
                      <LabeledInput
                        name="length_first"
                        placeholder="Длина первой части"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.length_first?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="subtype_data.length_second"
                    render={({ field }) => (
                      <LabeledInput
                        name="length_second"
                        placeholder="Длина второй части"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.length_second?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="subtype_data.length_third"
                    render={({ field }) => (
                      <LabeledInput
                        name="length_third"
                        placeholder="Длина третьей части"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        error={errors.subtype_data?.length_third?.message}
                        disabled={!showAdditionalFields}
                      />
                    )}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
