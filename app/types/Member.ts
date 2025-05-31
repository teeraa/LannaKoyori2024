import { BusinessInfo } from "./Business";

export interface Member {
  ID: number;
  BusinessID: number;
  NameThai: string;
  NameEng: string;
  RoleThai: string;
  RoleEng: string;
  Position: string;
  nationality: string;
  gender: string;
  Institute: string;
  Contact: string;
  Year: number;
  picture: string;
  businessinfo: BusinessInfo;
}
