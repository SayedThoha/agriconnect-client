export interface HttpResponseModel {
  message: string;
  success: boolean;
  statusCode: number;
  error: string;
  data?: object;
}

export interface OtpData {
  email: string;
  new_email?: string | null;
  otp: string;
  role?: string;
}

export interface UpdatePasswordRequest {
  email: string;
  password: string;
}

export interface ChartOptions {
  maintainAspectRatio: boolean;
  aspectRatio: number;
  plugins: {
    legend: {
      labels: {
        color: string;
      };
    };
  };
  scales: {
    x: {
      ticks: {
        color: string;
      };
      grid: {
        color: string;
      };
    };
    y: {
      ticks: {
        color: string;
      };
      grid: {
        color: string;
      };
    };
  };
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface Dataset {
  type: 'line' | 'bar';
  label: string;
  data: number[];
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  fill?: boolean;
  tension?: number;
}

export type HttpParamsInput = Record<
  string,
  string | number | boolean | readonly (string | number | boolean)[]
>;

export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}
