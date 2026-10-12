"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import {
  TStarProductSchema,
  useStarProduct,
  useStarProductSchema,
} from "@/features/product";
import { Button } from "@/shared/components/ui";
import { LabeledInput, LoadingSVG } from "@/shared/components";
import StarRating from "@/widgets/product/StarRating";

export function ProductComment() {
  const router = useRouter();
  const params = useParams();
  const requestId = parseInt(params.id as string);
  const schema = useStarProductSchema();
  const starMutation = useStarProduct();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
    watch,
  } = useForm<TStarProductSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      star: "",
      comment: "",
    },
  });

  async function onSubmit(payload: TStarProductSchema) {
    console.log({
      payload,
    });
    await starMutation.mutateAsync(
      {
        productId: requestId,
        payload: {
          star: payload.star,
          comment: payload.comment,
        },
      },
      {
        onSuccess: (data) => {
          console.log("aboba");
        },
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        // console.log("Validation errors:", errors);
      })}
    >
      <div>
        <Controller
          name="star"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col w-full items-center">
              <StarRating
                value={Number(field.value) || 0}
                onChange={(v) =>
                  setValue("star", v.toString(), { shouldValidate: true })
                }
              />

              {errors.star?.message && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.star.message}
                </span>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="comment"
          render={({ field }) => (
            <LabeledInput
              label="Комментарий"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.comment?.message}
            />
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 bg-button rounded-full mt-8"
          disabled={isSubmitting}
        >
          {isSubmitting && <LoadingSVG />}
          <span>Оценить</span>
        </Button>
      </div>
    </form>
  );
}
