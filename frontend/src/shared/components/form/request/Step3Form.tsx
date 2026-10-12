import { Controller } from "react-hook-form";
import { LabeledInput } from "@/shared/components";
import SelectField from "@/shared/components/form/SelectField";

interface Step3FormProps {
  control: any;
  errors: any;
  dictionaries: any;
  furniture_type_id: any;
  furniture_subtype_id: any;
  frame_id: any;
  length: any;
}

export function Step3Form({
  control,
  errors,
  dictionaries,
  furniture_type_id,
  furniture_subtype_id,
  frame_id,
  length,
}: Step3FormProps) {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-semibold mb-4">Контактная информация</h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
          <Controller
            control={control}
            name="client_name"
            render={({ field }) => (
              <LabeledInput
                name="client_name"
                label="ФИО"
                placeholder="Введите ФИО"
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.client_name?.message}
                disabled={
                  !furniture_type_id ||
                  (!furniture_subtype_id &&
                    ![3, 5].includes(furniture_type_id)) ||
                  (![3, 5].includes(furniture_type_id) && !frame_id)
                }
              />
            )}
          />

          <Controller
            control={control}
            name="client_phone"
            render={({ field }) => (
              <LabeledInput
                name="client_phone"
                label="Телефон"
                placeholder="Введите телефон"
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.client_phone?.message}
                disabled={
                  !furniture_type_id ||
                  (!furniture_subtype_id &&
                    ![3, 5].includes(furniture_type_id)) ||
                  (![3, 5].includes(furniture_type_id) && !frame_id)
                }
              />
            )}
          />

          <Controller
            control={control}
            name="client_address"
            render={({ field }) => (
              <LabeledInput
                name="client_address"
                label="Адрес клиента"
                placeholder="Введите адрес клиента"
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.client_address?.message}
                disabled={
                  !furniture_type_id ||
                  (!furniture_subtype_id &&
                    ![3, 5].includes(furniture_type_id)) ||
                  (![3, 5].includes(furniture_type_id) && !frame_id)
                }
              />
            )}
          />
        </div>
        <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <LabeledInput
                name="description"
                label="Комментарий"
                placeholder="Введите Комментарий"
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.description?.message}
                disabled={
                  !furniture_type_id ||
                  (!furniture_subtype_id &&
                    ![3, 5].includes(furniture_type_id)) ||
                  (![3, 5].includes(furniture_type_id) && !frame_id)
                }
              />
            )}
          />
        </div>

        <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4 mb-16">
          <Controller
            control={control}
            name="workshop_id"
            render={({ field }) => (
              <SelectField
                subLabel="Цех"
                value={field.value}
                onChange={field.onChange}
                options={dictionaries.workshops}
                placeholder="Выберите Цех"
                error={errors.workshop_id?.message}
                disabled={
                  !furniture_type_id ||
                  (!furniture_subtype_id &&
                    ![3, 5].includes(furniture_type_id)) ||
                  (![3, 5].includes(furniture_type_id) && !frame_id)
                }
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
