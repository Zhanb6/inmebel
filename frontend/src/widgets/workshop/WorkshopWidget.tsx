import { useOrders } from "@/features/workshop";
import Card from "@/features/workshop/components/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Skeleton,
} from "@/shared/components/ui";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function WorkshopWidget() {
  const { data: session, status } = useSession();
  const { data, isPending, isError } = useOrders();

  // Loading
  if (isPending)
    return (
      <div className="container mt-12 grid w-full grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-[240px] w-full bg-gray-300" />
            <Skeleton className="h-2 w-1/2 bg-gray-300" />
          </div>
        ))}
      </div>
    );

  // Error
  if (isError) return <div>ОШИБКА</div>;

  const workshops = Array.isArray((data as any)?.data)
    ? (data as any).data
    : [];

  // Фильтруем мастерские по статусу
  const activeWorkshops = workshops.filter(
    (workshop: any) => workshop.status === "active" || !workshop.status,
  );

  return (
    <div className="flex flex-col items-center justify-center space-y-5">
      <Tabs defaultValue="active" className="w-full max-w-[400px] mt-6">
        <div className="flex justify-center mb-4">
          <TabsList className="bg-[#C8E6C9] rounded-full p-1">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-[#85ac8d] data-[state=active]:text-white rounded-full transition-all"
            >
              Активные
              {activeWorkshops.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeWorkshops.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex justify-center w-full mb-4">
          <Input
            type="search"
            placeholder="Поиск мастерской"
            className="w-[361px] rounded-[12px] h-10 outline outline-[#cacdd0] text-base px-3 py-2 shadow-xs transition-colors duration-150 ease-in-out focus-visible:outline-none focus:outline-[#85ac8d]"
          />
        </div>

        <TabsContent value="active">
          <div className="grid gap-[16px] mx-2.5 mb-25">
            {activeWorkshops.length > 0 ? (
              activeWorkshops.map((workshop: any) => (
                <Link key={workshop.id} href={`/orders/${workshop.id}`}>
                  <Card
                    key={workshop.id}
                    data={workshop}
                    session={session?.access}
                  />
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Активные мастерские не найдены
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
