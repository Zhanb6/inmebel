import { z } from "zod";

// Базовый объект для subtype_data
const baseSubtypeDataSchema = z.object({
  length: z.number().optional(),
  length_first: z.number().optional(),
  length_second: z.number().optional(),
  length_third: z.number().optional(),
  height: z.number().optional(),
  count_door: z.number().optional(),
});

// Создаем условную валидацию с помощью .superRefine
export const createClientRequestSchema = z
  .object({
    furniture_type_id: z.number({ required_error: "Тип мебели обязателен" }).optional(),
    furniture_subtype_id: z.number({ required_error: "Подтип мебели обязателен" }).optional(),
    workshop_id: z.number({ required_error: "Тип Цеха обязателен" }),
    address: z.string({ required_error: "Адрес обязателен" }).trim().min(1, "Адрес обязателен").optional(),
    description: z.string({ required_error: "Описание обязательно" }).trim().min(1, "Описание обязательно").optional(),
    frame_id: z.number({ required_error: "Каркас обязателен" }).optional(),
    facade_id: z.number({ required_error: "Фасад обязателен" }).optional(),
    facade_type_id: z.number({ required_error: "Тип фасада обязателен" }).optional(),
    facade_color_id: z.number({ required_error: "Цвет фасада обязателен" }).optional(),
    brand_id: z.number({ required_error: "Фурнитура обязательна" }).optional(),
    length: z.number({ required_error: "Длина обязательна" }).positive("Длина должна быть положительным числом").optional(),
    height: z.number({ required_error: "Высота обязательна" }).positive("Высота должна быть положительным числом").optional(),

    client_name: z.string({ required_error: "Поле client name является обязательным." }).trim().min(1, "Поле имя является обязательным."),
client_iin: z.string({ required_error: "Поле client iin является обязательным." }).trim().min(1, "Поле ИИН является обязательным."),
client_phone: z.string({ required_error: "Поле client phone является обязательным." }).trim().min(1, "Поле Телефон является обязательным."),
client_address: z.string({ required_error: "Поле client address является обязательным." }).trim().min(1, "Поле адрес является обязательным."),
    
    // Поля для зеркала (тип 5)
    mirror_frame_id: z.number({ 
      required_error: "Рама зеркала обязательна" 
    }).optional(),
    
    mirror_backlight_id: z.number({ 
      required_error: "Подсветка зеркала обязательна" 
    }).optional(),
    
    mirror_form_id: z.number({ 
      required_error: "Форма зеркала обязательна" 
    }).optional(),
    
    // Поле для кухни (тип 1) - материал столешницы
    kitchen_tabletop_id: z.number({ 
      required_error: "Материал столешницы обязателен для кухни" 
    }).optional(),

        console_tabletop_id: z.number({ 
      required_error: "Материал столешницы обязателен" 
    }).optional(),

    subtype_data: baseSubtypeDataSchema.optional(),

    filling: z.array(
      z.object({
        id: z.number().min(1, "Выберите тип наполнения"),
        count: z.number().min(1, "Количество должно быть не менее 1"),
      })
    ).default([]).optional(),

    addons: z.array(
      z.object({
        id: z.number({ required_error: "ID дополнения обязателен" }),
        data_type: z.string({ required_error: "Тип данных дополнения обязателен" }).trim(),
        count: z.number({ required_error: "Количество дополнений обязательно" }).min(1, "Минимальное количество — 1"),
        length: z.number({ required_error: "Длина дополнения обязательна" }).positive("Длина должна быть положительным числом"),
        height: z.number().positive("Высота должна быть положительным числом").optional(),
      })
    ).default([]).optional(),
  })
  .superRefine((data, ctx) => {
    // ВАЛИДАЦИЯ ДЛЯ ТИПА МЕБЕЛИ 5 (зеркало)
    if (data.furniture_type_id === 5) {
      if (!data.mirror_frame_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Рама зеркала является обязательной",
          path: ["mirror_frame_id"],
        });
      }
      
      if (!data.mirror_backlight_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Подсветка зеркала является обязательной",
          path: ["mirror_backlight_id"],
        });
      }
      
      if (!data.mirror_form_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Форма зеркала является обязательной",
          path: ["mirror_form_id"],
        });
      }
    }

    // ВАЛИДАЦИЯ ДЛЯ ТИПА МЕБЕЛИ 1 (кухни)
    if (data.furniture_type_id === 1) {
      // Для кухни проверяем материал столешницы
      if (!data.kitchen_tabletop_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Материал столешницы является обязательным для кухни",
          path: ["kitchen_tabletop_id"],
        });
      }

      // Дополнительные проверки для разных подтипов кухни
      if (data.furniture_subtype_id === 2) {
        if (!data.subtype_data?.length_first) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.length first является обязательным.",
            path: ["subtype_data", "length_first"],
          });
        }
        if (!data.subtype_data?.length_second) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.length second является обязательным.",
            path: ["subtype_data", "length_second"],
          });
        }
      }
      
      if (data.furniture_subtype_id === 3) {
        if (!data.subtype_data?.length_first) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.length first является обязательным.",
            path: ["subtype_data", "length_first"],
          });
        }
        if (!data.subtype_data?.length_second) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.length second является обязательным.",
            path: ["subtype_data", "length_second"],
          });
        }
        if (!data.subtype_data?.length_third) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.length third является обязательным.",
            path: ["subtype_data", "length_third"],
          });
        }
      }
      
      if (data.furniture_subtype_id === 4) {
        if (!data.subtype_data?.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.length является обязательным.",
            path: ["subtype_data", "length"],
          });
        }
      }
    }
    
    // ВАЛИДАЦИЯ ДЛЯ ТИПА МЕБЕЛИ 2 (шкафы)
    if (data.furniture_type_id === 2) {
      // Для шкафов - только count_door
      if (data.furniture_subtype_id === 5) {
        if (!data.subtype_data?.count_door) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.count door является обязательным.",
            path: ["subtype_data", "count_door"],
          });
        }
      }
      
      if (data.furniture_subtype_id === 6) {
        if (!data.subtype_data?.count_door) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.count door является обязательным.",
            path: ["subtype_data", "count_door"],
          });
        }
      }
    }
    
    // ВАЛИДАЦИЯ ДЛЯ ТИПА МЕБЕЛИ 4
    if (data.furniture_type_id === 4) {
      if (data.furniture_subtype_id === 7) {
        if (!data.subtype_data?.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.length является обязательным.",
            path: ["subtype_data", "length"],
          });
        }
        if (!data.subtype_data?.height) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.height является обязательным.",
            path: ["subtype_data", "height"],
          });
        }
      }
      
      if (data.furniture_subtype_id === 8) {
        if (!data.subtype_data?.length_first) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.length first является обязательным.",
            path: ["subtype_data", "length_first"],
          });
        }
        if (!data.subtype_data?.length_second) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.length second является обязательным.",
            path: ["subtype_data", "length_second"],
          });
        }
        if (!data.subtype_data?.height) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.height является обязательным.",
            path: ["subtype_data", "height"],
          });
        }
      }
      
      if (data.furniture_subtype_id === 9) {
        if (!data.subtype_data?.height) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.height является обязательным.",
            path: ["subtype_data", "height"],
          });
        }
        if (!data.subtype_data?.length_first) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.length first является обязательным.",
            path: ["subtype_data", "length_first"],
          });
        }
        if (!data.subtype_data?.length_second) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.length second является обязательным.",
            path: ["subtype_data", "length_second"],
          });
        }
        if (!data.subtype_data?.length_third) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Поле subtype data.length third является обязательным.",
            path: ["subtype_data", "length_third"],
          });
        }
      }
    }
  });

export type TClientRequestSchema = z.infer<typeof createClientRequestSchema>;