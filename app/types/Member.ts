import { BusinessInfo } from "./Business";

export interface PersonInfo {
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
  description?: string;
}

export interface Member {
  ProvinceT: string;
  BussinessNameEng: any;
  DataYear: string;
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
  personinfo: PersonInfo;
}
