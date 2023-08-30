export interface SuccessCreatingUser {
  name: string;
  username: string;
  email: string;
}

export interface GeneralSuccess {
  message: string;
  detail: any;
}

export interface SuccessWithDataMeta {
  message: string;
  detail: {
    data: any;
    meta: {
      currentPage: number;
      nextPage: number | null;
      itemsShowed: number;
      totalItems: number;
    };
  };
}

export interface SuccessWithData {
  message: string;
  detail: {
    data: any;
  };
}

export interface SuccessWithDataAuthor {
  message: string;
  detail: {
    data: any;
    meta: any;
  };
}
