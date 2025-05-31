import { Material } from "./Material";
import { Member } from "./Member";

export interface Product {
  ID: number;
  productName: string;
  price: number;
  mainMaterial: number;
  subMaterial1: number;
  subMaterial2: number;
  subMaterial3: number;
  bussinessID: number;
  image: string;
  sketch: string;
  description: string | null;
  color: string | null;
  size: string | null;
  materialMain: Material;
  materialSub1: Material;
  materialSub2: Material;
  materialSub3: Material;
  businessinfo: Member;
}
