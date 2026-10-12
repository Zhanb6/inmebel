"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  return (
    <div className="bg-white min-h-screen text-gray-900 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => router.back()} className="text-gray-700 text-lg">
          ←
        </button>
        <h1 className="font-semibold text-base">О ПРОДУКТЕ</h1>
        <div className="w-6 h-6" />
      </div>

      {/* Product Image */}
      <div className="w-full flex justify-center">
        <Image
          src="/assets/images/mebel.svg"
          alt="Описание мебели"
          width={361}
          height={256}
          className="rounded-xl shadow-lg"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <h2 className="text-lg font-semibold leading-tight">
          Кровать двуспальная б/у 160×200 с матрасом ТОРГ
        </h2>
        <p className="text-xl font-bold text-green-700">35 000 ₸</p>

        <div className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white">
          <h3 className="font-semibold text-base mb-2">Описание мебели</h3>
          <p className="text-sm text-gray-600 mb-2">
            Создаю мебель, которая отражает ваш стиль и идеально вписывается в
            пространство.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Индивидуальный подход</li>
            <li>Натуральные материалы</li>
            <li>Эскизы и 3D-визуализация</li>
            <li>Контроль на всех этапах</li>
          </ul>
        </div>

        {/* Characteristics */}
        <div className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white">
          <h3 className="font-semibold text-base mb-1">Характеристики</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Ширина: 160 см</li>
            <li>Длина: 200 см</li>
            <li>Материал: дерево</li>
            <li>Состояние: б/у</li>
            <li>Наличие: в наличии</li>
          </ul>
        </div>

        {/* Reviews */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base">Отзывы</h3>

          <div className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white">
            <p className="text-sm font-medium">Жанна К.</p>
            <p className="text-xs text-yellow-500">★★★★★</p>
            <p className="text-sm mt-1 text-gray-700">
              Удобная кровать. Спали с мужем с удовольствием!
            </p>
            <p className="text-sm font-medium">Айгул Т.</p>
            <p className="text-xs text-yellow-500">★★★★☆</p>
            <p className="text-sm mt-1 text-gray-700">
              Всё хорошо, немного потертости, но в целом норм.
            </p>
          </div>
        </div>
      </div>

      {/* Advertisement */}
      <div className="bg-[#85ac8d] text-center p-4 mt-4 rounded-[8px] h-[152px] flex justify-center items-center">
        <span className="text-white font-semibold text-[23px] text-center">
          ВАША РЕКЛАМА
        </span>
      </div>

      {/* Similar Products */}
      <div className="p-4">
        <h3 className="font-semibold mb-2 text-[16px]">ВЫ СМОТРЕЛИ</h3>
        <div className="grid grid-cols-2 gap-6 justify-center">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Image
                src="/assets/images/poster.svg"
                alt="Описание мебели"
                width={179}
                height={209}
                className="rounded-[10px] shadow-md border border-[#A5D6A7]"
              />
              <div className="grid text-center mt-2">
                <span className="font-medium text-[12px] text-[#1B5E20]">
                  Product Name
                </span>
                <span className="font-semibold text-[14px] text-[#2E7D32]">
                  150 000 ТГ
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-between items-center">
        <button className="flex-1 bg-green-600 text-white py-2 rounded-md font-medium">
          Купить сейчас
        </button>
      </div>
    </div>
  );
}
