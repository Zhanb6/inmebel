type ClientProfileResponse = {
  role: "client";
  user: {
    id: number;
    name: string;
    phone: string;
    created_at: string;
    client_data: {
      iin: string;
      address: string;
    };
  };
};

type WorkshopProfileResponse = {
  role: "workshop";
  user: {
    id: number;
    name: string;
    phone: string;
    created_at: string;
    workshop_data: {
      accepted_at: string | null;
      name: string;
      iin: string;
      address: string;
      media: any[]; 
    };
    client_data: {
      iin: string;
      address: string;
    }
  };
};

export type ProfileResponse = ClientProfileResponse | WorkshopProfileResponse;
