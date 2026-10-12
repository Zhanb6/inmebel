import { Controller } from "react-hook-form";
import SelectField from "@/shared/components/form/SelectField";
import { ScrollablePicker } from "@/shared/components/form/ScrollablePicker";
import { useFormFilters } from "@/features/client/hooks/useFormFilters";

interface Step2FormProps {
  control: any;
  errors: any;
  dictionaries: any;
  furniture_type_id: any;
  furniture_subtype_id: any;
  frame_id: any;
  facade_id: any;
  facade_type_id: any;
  length: any;
  selectedFurnitureId: number | null;
}

export function Step2Form({
  control,
  errors,
  dictionaries,
  furniture_type_id,
  furniture_subtype_id,
  frame_id,
  facade_id,
  facade_type_id,
  length,
  selectedFurnitureId,
}: Step2FormProps) {
  const { selectedFacade, facadeTypes, facadeColors, showFacadeFields } =
    useFormFilters({
      dictionaries,
      furniture_type_id,
      facade_id,
    });

  // Проверяем, является ли текущий тип зеркалом
  const isMirror = furniture_type_id === 5;

  return (
    <div className="w-full space-y-6">
      {/* Для ЗЕРКАЛА (type_id = 5) показываем только зеркальные поля */}
      {isMirror ? (
        <div className="space-y-6">
          {/* Рама зеркала */}
          <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
            <Controller
              control={control}
              name="mirror_frame_id"
              render={({ field }) => (
                <SelectField
                  label="РАМА ЗЕРКАЛА"
                  subLabel="Материал рамы"
                  value={field.value}
                  onChange={field.onChange}
                  options={dictionaries.mirrorFrames}
                  placeholder="Выберите раму зеркала"
                  error={errors.mirror_frame_id?.message}
                  disabled={!furniture_type_id}
                />
              )}
            />
          </div>

          {/* Подсветка зеркала */}
          <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
            <Controller
              control={control}
              name="mirror_backlight_id"
              render={({ field }) => (
                <SelectField
                  label="ПОДСВЕТКА ЗЕРКАЛА"
                  subLabel="Тип подсветки"
                  value={field.value}
                  onChange={field.onChange}
                  options={dictionaries.mirrorBacklights}
                  placeholder="Выберите подсветку"
                  error={errors.mirror_backlight_id?.message}
                  disabled={!furniture_type_id}
                />
              )}
            />
          </div>

          {/* Форма зеркала */}
          <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4 mb-20px">
            <Controller
              control={control}
              name="mirror_form_id"
              render={({ field }) => (
                <SelectField
                  label="ФОРМА ЗЕРКАЛА"
                  subLabel="Форма зеркала"
                  value={field.value}
                  onChange={field.onChange}
                  options={dictionaries.mirrorForms}
                  placeholder="Выберите форму зеркала"
                  error={errors.mirror_form_id?.message}
                  disabled={!furniture_type_id}
                />
              )}
            />
          </div>
        </div>
      ) : (
        /* Для ВСЕХ остальных типов (не зеркало) показываем стандартные поля */
        <>
          {furniture_type_id === 3 && (
            <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
              <Controller
                control={control}
                name="console_tabletop_id" // или другое имя поля, которое используется в схеме
                render={({ field }) => (
                  <SelectField
                    label="МАТЕРИАЛ СТОЛЕШНИЦЫ"
                    value={field.value}
                    onChange={field.onChange}
                    options={dictionaries.consoleTabletops || []} // предполагается, что в словарях есть kitchenMaterials
                    placeholder="Выберите материал"
                    error={errors.console_tabletop_id?.message}
                    disabled={!furniture_type_id}
                  />
                )}
              />
            </div>
          )}

          {/* Корпус и наполнение */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
              <Controller
                control={control}
                name="frame_id"
                render={({ field }) => (
                  <>
                    <div className="text-gray-500 mb-2 text-sm">
                      Материал корпуса
                    </div>

                    <div className="flex bg-gray-100 rounded-full p-1 w-full">
                      {dictionaries.frames && dictionaries.frames.length > 0 ? (
                        dictionaries.frames.map((frame: any) => {
                          const isActive = field.value === frame.id;

                          return (
                            <button
                              key={frame.id}
                              type="button"
                              onClick={() => field.onChange(frame.id)}
                              disabled={!furniture_type_id}
                              className={`
                        flex-1 text-center py-2 rounded-full font-medium transition
                        disabled:opacity-50 disabled:cursor-not-allowed w-[185px] h-[40px]
                        ${
                          isActive
                            ? "bg-white border border-green-500 text-green-600"
                            : "text-gray-500 hover:text-gray-700"
                        }
                      `}
                            >
                              {frame.name}
                            </button>
                          );
                        })
                      ) : (
                        <div className="flex-1 text-center py-2 rounded-full text-gray-400 italic">
                          {!furniture_type_id
                            ? "Сначала выберите тип и форму"
                            : "Нет доступных материалов"}
                        </div>
                      )}
                    </div>

                    {/* Сообщение об ошибке */}
                    {errors.frame_id && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.frame_id.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            {furniture_type_id !== 3 && (
              <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
                {/* Наполнение с count */}

                <Controller
                  control={control}
                  name="filling"
                  render={({ field }) => (
                    <div className=" max-w-md space-y-4">
                      {/* Заголовок */}
                      <div className="text-gray-500 text-lg font-medium">
                        Наполнение
                      </div>

                      {/* Выбранные наполнения */}
                      <div className="space-y-3">
                        {field.value?.map((fillItem: any, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            {/* Название выбранного наполнения */}
                            <div className="flex items-center justify-between border border-green-500 rounded-full px-4 py-2 text-green-600 w-fit whitespace-nowrap min-w-[180px]">
                              <span className="font-medium">
                                {dictionaries.filling?.find(
                                  (f: any) => f.id === fillItem.id,
                                )?.name || "Выберите наполнение"}
                              </span>
                              {/* Кнопка удаления */}
                              <button
                                type="button"
                                className="ml-3 text-gray-400 hover:text-red-500 text-lg"
                                onClick={() => {
                                  const newFilling = [...(field.value || [])];
                                  newFilling.splice(index, 1);
                                  field.onChange(
                                    newFilling.length > 0
                                      ? newFilling
                                      : undefined,
                                  );
                                }}
                                disabled={!furniture_type_id}
                              >
                                ×
                              </button>
                            </div>

                            {/* Счетчик количества */}
                            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-4">
                              <button
                                type="button"
                                className="text-gray-600 text-lg hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                onClick={() => {
                                  const newFilling = [...(field.value || [])];
                                  const newCount = Math.max(
                                    1,
                                    (fillItem.count || 1) - 1,
                                  );
                                  newFilling[index] = {
                                    ...newFilling[index],
                                    count: newCount,
                                  };
                                  field.onChange(newFilling);
                                }}
                                disabled={!furniture_type_id}
                              >
                                −
                              </button>
                              <span className="font-medium min-w-[20px] text-center">
                                {fillItem.count || 1}
                              </span>
                              <button
                                type="button"
                                className="text-gray-600 text-lg hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                onClick={() => {
                                  const newFilling = [...(field.value || [])];
                                  const newCount = (fillItem.count || 1) + 1;
                                  newFilling[index] = {
                                    ...newFilling[index],
                                    count: newCount,
                                  };
                                  field.onChange(newFilling);
                                }}
                                disabled={!furniture_type_id}
                              >
                                +
                              </button>
                            </div>

                            {/* Select для выбора наполнения (скрытый или для замены) */}
                            <select
                              className="hidden"
                              value={fillItem.id || ""}
                              onChange={(e) => {
                                const newFilling = [...(field.value || [])];
                                const value = e.target.value
                                  ? Number(e.target.value)
                                  : undefined;

                                if (value) {
                                  newFilling[index] = {
                                    ...newFilling[index],
                                    id: value,
                                    count: newFilling[index]?.count || 1,
                                  };
                                  field.onChange(newFilling);
                                }
                              }}
                            >
                              <option value="">Выберите наполнение</option>
                              {dictionaries.filling?.map((fill: any) => (
                                <option key={fill.id} value={fill.id}>
                                  {fill.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>

                      {/* Если нет выбранных наполнений */}
                      {(!field.value || field.value.length === 0) && (
                        <div className="text-gray-400 text-center py-4">
                          Нет выбранных наполнений
                        </div>
                      )}

                      {/* Сообщение об ошибке */}
                      {errors.filling?.message && (
                        <p className="text-red-500 text-sm">
                          {errors.filling.message as string}
                        </p>
                      )}

                      {/* Блок добавления новых наполнений */}
                      <div>
                        <div className="text-gray-400 text-sm mb-3">
                          Добавить:
                        </div>

                        {/* Горизонтальный скролл для всех доступных наполнений */}
                        <div className="overflow-x-auto no-scrollbar pb-2">
                          <div className="flex gap-2 w-max min-w-full">
                            {dictionaries.filling?.map((fill: any) => {
                              // Проверяем, уже ли выбрано это наполнение
                              const isAlreadySelected = field.value?.some(
                                (item: any) => item.id === fill.id,
                              );

                              return (
                                <button
                                  key={fill.id}
                                  type="button"
                                  onClick={() => {
                                    if (isAlreadySelected) {
                                      // Увеличиваем количество, если уже выбрано
                                      const newFilling = [
                                        ...(field.value || []),
                                      ];
                                      const itemIndex = newFilling.findIndex(
                                        (item: any) => item.id === fill.id,
                                      );
                                      if (itemIndex !== -1) {
                                        newFilling[itemIndex] = {
                                          ...newFilling[itemIndex],
                                          count:
                                            (newFilling[itemIndex].count || 1) +
                                            1,
                                        };
                                        field.onChange(newFilling);
                                      }
                                    } else {
                                      // Добавляем новое наполнение
                                      const currentFilling = field.value || [];
                                      field.onChange([
                                        ...currentFilling,
                                        { id: fill.id, count: 1 },
                                      ]);
                                    }
                                  }}
                                  disabled={!furniture_type_id}
                                  className={`
                        flex items-center gap-2 
                        ${
                          isAlreadySelected
                            ? "bg-green-50 border border-green-200 text-green-700"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }
                        rounded-full px-4 py-2 whitespace-nowrap 
                        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                                >
                                  <span
                                    className={`text-lg ${
                                      isAlreadySelected
                                        ? "text-green-600"
                                        : "text-green-500"
                                    }`}
                                  >
                                    +
                                  </span>
                                  <span className="font-medium">
                                    {fill.name}
                                  </span>
                                </button>
                              );
                            })}

                            {/* Если нет доступных наполнений */}
                            {(!dictionaries.filling ||
                              dictionaries.filling.length === 0) && (
                              <div className="text-gray-400 italic px-4 py-2">
                                Нет доступных вариантов наполнения
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Индикатор скролла (опционально) */}
                      <div className="text-xs text-gray-400 text-center">
                        ← прокрутите для просмотра всех вариантов →
                      </div>
                    </div>
                  )}
                />
              </div>
            )}
          </div>

          {/* Фасад, тип фасада и цвет фасада */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
              {/* Фасад */}
              <Controller
                control={control}
                name="facade_id"
                render={({ field }) => (
                  <SelectField
                    label="ФАСАД"
                    subLabel="Материал Фасада"
                    value={field.value}
                    onChange={field.onChange}
                    options={dictionaries.facades}
                    placeholder="Выберите фасад"
                    error={errors.facade_id?.message}
                    disabled={
                      !furniture_type_id ||
                      (furniture_type_id !== 3 && !frame_id) ||
                      !showFacadeFields
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="facade_type_id"
                render={({ field }) => (
                  <ScrollablePicker
                    title="Тип фасада"
                    items={facadeTypes}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.facade_type_id?.message}
                    disabled={
                      !furniture_type_id ||
                      !frame_id ||
                      !facade_id ||
                      !showFacadeFields
                    }
                    type="image"
                  />
                )}
              />

              {/* Цвет фасада */}
              <Controller
                control={control}
                name="facade_color_id"
                render={({ field }) => (
                  <ScrollablePicker
                    title="Цвет Фасада"
                    items={facadeColors}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.facade_color_id?.message}
                    disabled={
                      !furniture_type_id ||
                      !frame_id ||
                      !facade_id ||
                      !facade_type_id ||
                      !showFacadeFields
                    }
                    type="color"
                  />
                )}
              />
            </div>
          </div>
          {/* Для типа 1 (кухня) - дополнительный SelectField */}
          {furniture_type_id === 1 && (
            <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
              <Controller
                control={control}
                name="kitchen_tabletop_id" // или другое имя поля, которое используется в схеме
                render={({ field }) => (
                  <SelectField
                    label="МАТЕРИАЛ СТОЛЕШНИЦЫ"
                    subLabel="Материал для кухни"
                    value={field.value}
                    onChange={field.onChange}
                    options={dictionaries.kitchenTabletops || []} // предполагается, что в словарях есть kitchenMaterials
                    placeholder="Выберите материал"
                    error={errors.kitchen_tabletop_id?.message}
                    disabled={!furniture_type_id}
                  />
                )}
              />
            </div>
          )}

          {/* Бренд */}
          <div className="w-full">
            <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
              <Controller
                control={control}
                name="brand_id"
                render={({ field }) => (
                  <SelectField
                    label="Фурнитура"
                    subLabel="Выбрать фурнитуру"
                    value={field.value}
                    onChange={field.onChange}
                    options={dictionaries.brands}
                    placeholder="Выберите фурнитуру"
                    error={errors.brand_id?.message}
                    disabled={!furniture_type_id || !frame_id}
                  />
                )}
              />
            </div>
          </div>

          {/* Дополнения */}
          <div className="w-full">
            <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4 mb-16">
              <Controller
                control={control}
                name="addons"
                render={({ field }) => {
                  // Находим текущий тип мебели
                  const currentFurnitureType =
                    dictionaries.furnitureTypes?.find(
                      (type: any) => type.id === furniture_type_id,
                    );

                  // Получаем addons для текущего типа мебели
                  const currentAddons = currentFurnitureType?.addons || [];

                  return (
                    <div className="flex flex-col gap-1">
                      <label className="font-medium text-[12px]">
                        ДОПОЛНИТЕЛЬНОЕ
                      </label>

                      {/* Список дополнений */}
                      {field.value?.map((addonItem: any, index: any) => (
                        <div key={index} className="rounded-lg mb-4">
                          {/* Выбор конкретного дополнения */}
                          <div className="mb-3 grid">
                            <label className="font-normal text-[12px] mb-2">
                              Дополнительное
                            </label>
                            <select
                              className="custom-select disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                              value={addonItem.id || ""}
                              onChange={(e) => {
                                const newAddons = [...(field.value || [])];
                                const value = e.target.value
                                  ? Number(e.target.value)
                                  : undefined;

                                if (value) {
                                  // Находим выбранный addon
                                  const selectedAddon = currentAddons.find(
                                    (addon: any) => addon.id === value,
                                  );

                                  newAddons[index] = {
                                    ...newAddons[index],
                                    id: value,
                                    data_type:
                                      selectedAddon?.data_type ||
                                      "furniture_addon_plus_rule_data",
                                  };
                                } else {
                                  newAddons.splice(index, 1);
                                }

                                field.onChange(
                                  newAddons.length > 0 ? newAddons : undefined,
                                );
                              }}
                              disabled={!furniture_type_id || !frame_id}
                            >
                              <option value="">Выберите дополнение</option>
                              {currentAddons.map((addon: any) => (
                                <option key={addon.id} value={addon.id}>
                                  {addon.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Поля для count, length и height, если дополнение выбрано */}
                          {addonItem.id && (
                            <div className="space-y-3">
                              {/* Первая строка: Тип и Количество */}
                              <div className="flex gap-3 items-end">
                                {/* Отображение выбранного дополнения */}
                                <div className="flex-1">
                                  <label className="font-medium text-sm block mb-1">
                                    Тип
                                  </label>
                                  <div className="custom-select w-full bg-gray-100 text-gray-500 p-2 rounded-md">
                                    {currentAddons.find(
                                      (addon: any) => addon.id === addonItem.id,
                                    )?.name || "Не выбрано"}
                                  </div>
                                </div>

                                {/* Количество */}
                                <div>
                                  <label className="font-medium text-sm block mb-1">
                                    Количество
                                  </label>
                                  <div className="flex border border-[#cacdd0] rounded-[12px] overflow-hidden w-[120px] h-[41px]">
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center text-xl text-[#85ac8d] hover:text-[#6d8f73] disabled:text-gray-400 disabled:cursor-not-allowed"
                                      onClick={() => {
                                        const newAddons = [
                                          ...(field.value || []),
                                        ];
                                        const newCount = Math.max(
                                          1,
                                          (addonItem.count || 1) - 1,
                                        );
                                        newAddons[index] = {
                                          ...newAddons[index],
                                          count: newCount,
                                        };
                                        field.onChange(newAddons);
                                      }}
                                      disabled={!furniture_type_id || !frame_id}
                                    >
                                      −
                                    </button>

                                    <input
                                      type="number"
                                      min="1"
                                      className="w-full text-center outline-none text-base disabled:bg-gray-100 disabled:text-gray-500"
                                      value={addonItem.count || 1}
                                      onChange={(e) => {
                                        const newAddons = [
                                          ...(field.value || []),
                                        ];
                                        const newCount = Math.max(
                                          1,
                                          Number(e.target.value),
                                        );
                                        newAddons[index] = {
                                          ...newAddons[index],
                                          count: newCount,
                                        };
                                        field.onChange(newAddons);
                                      }}
                                      disabled={!furniture_type_id || !frame_id}
                                    />

                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center text-xl text-[#85ac8d] hover:text-[#6d8f73] disabled:text-gray-400 disabled:cursor-not-allowed"
                                      onClick={() => {
                                        const newAddons = [
                                          ...(field.value || []),
                                        ];
                                        const newCount =
                                          (addonItem.count || 1) + 1;
                                        newAddons[index] = {
                                          ...newAddons[index],
                                          count: newCount,
                                        };
                                        field.onChange(newAddons);
                                      }}
                                      disabled={!furniture_type_id || !frame_id}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Вторая строка: Длина */}
                            </div>
                          )}

                          {/* Кнопка удаления (только если больше одного элемента) */}
                          {field.value && field.value.length > 1 && (
                            <div className="flex justify-end mt-3">
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                                onClick={() => {
                                  const newAddons = [...(field.value || [])];
                                  newAddons.splice(index, 1);
                                  field.onChange(
                                    newAddons.length > 0
                                      ? newAddons
                                      : undefined,
                                  );
                                }}
                                disabled={!furniture_type_id || !frame_id}
                              >
                                Удалить дополнение
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      {errors.addons?.message && (
                        <p className="text-red-500 text-sm">
                          {errors.addons.message}
                        </p>
                      )}

                      {/* Кнопка добавления нового дополнения */}
                      <button
                        type="button"
                        className="font-normal text-[18px] text-[#838383] mt-2 text-left hover:text-[#85ac8d] disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                        onClick={() => {
                          const currentAddons = field.value || [];
                          field.onChange([
                            ...currentAddons,
                            {
                              id: undefined,
                              data_type: "furniture_addon_plus_rule_data",
                              count: 1,
                              length: 1,
                              height: 1,
                            },
                          ]);
                        }}
                        disabled={
                          !furniture_type_id ||
                          !frame_id ||
                          currentAddons.length === 0
                        }
                      >
                        + ДОБАВИТЬ ЕЩЕ ДОПОЛНЕНИЕ
                      </button>

                      {furniture_type_id && currentAddons.length === 0 && (
                        <p className="text-gray-400 text-sm mt-2">
                          Для выбранного типа мебели нет доступных дополнений
                        </p>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
