import { Injectable } from '@angular/core';

export type DepartmentSlug = 'computadores' | 'kit-upgrade' | 'hardware' | 'monitores';

export interface Department {
  slug: DepartmentSlug;
  label: string;
  icon: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  department: DepartmentSlug;
  category: string;
  description?: string;
}

export const DEPARTMENTS: Department[] = [
  { slug: 'computadores', label: 'Computadores', icon: 'fa-solid fa-desktop', description: 'PCs gamer e de escritório prontos para usar' },
  { slug: 'kit-upgrade', label: 'Kits Upgrade', icon: 'fa-solid fa-layer-group', description: 'Processador e placa-mãe que já funcionam juntos' },
  { slug: 'hardware', label: 'Hardware', icon: 'fa-solid fa-microchip', description: 'Placas de vídeo, processadores, memórias e fontes' },
  { slug: 'monitores', label: 'Monitores', icon: 'fa-solid fa-display', description: 'Monitores gamer de 100 Hz a 310 Hz' }
];

const IMG = 'assets/products/';

// Catálogo único da loja. Quando o backend tiver /api/produtos,
// basta trocar estes métodos por chamadas HTTP.
const PRODUCTS: Product[] = [
  { id: 0, name: 'Placa mãe AsRock X870 Pro', price: 1760.72, image: IMG + 'ASROCK_PLACAMAE_X870_PRO.jpg', department: 'hardware', category: 'Placa-mãe' },
  { id: 1, name: 'Placa mãe GIGABYTE A520M', price: 444.0, image: IMG + 'PLACAMAE_GIGABYTE_A520M.jpg', department: 'hardware', category: 'Placa-mãe' },
  { id: 2, name: 'Placa mãe MSI A520-A Pro', price: 443.64, image: IMG + 'PLACAMAE_MSI_A520-A_PRO.jpg', department: 'hardware', category: 'Placa-mãe' },
  { id: 3, name: 'Memória XPG Spectrix RGB 16GB DDR4 3200Mhz', price: 447.9, image: IMG + 'MEMÓRIA_RAM_XPG_SPECTRIX_RGB_16GB_DDR4_3200MHZ.jpg', department: 'hardware', category: 'Memória RAM' },
  { id: 4, name: 'Memória Corsair VENGEANCE RGB 32GB DDR5', price: 810.0, image: IMG + 'CORSAIR_VENGEANCE_RGB_DDR5_RAM_32GB.jpg', department: 'hardware', category: 'Memória RAM' },
  { id: 5, name: 'Memória FURY Beast 16GB DDR4 3200Mhz', price: 469.99, image: IMG + 'MEMÓRIA_RAM_16GB_DDR4_3200MHZ_FURY_BEAST.jpg', department: 'hardware', category: 'Memória RAM' },
  { id: 6, name: 'Fonte de alimentação Corsair atx 650W 80 Plus Bronze', price: 455.99, image: IMG + 'FONTE_CORSAIR_ATX_650W_80_PLUSBRONZE.jpg', department: 'hardware', category: 'Fonte' },
  { id: 7, name: 'Fonte de alimentação Maximus atx 650W 80 Plus Bronze', price: 319.99, image: IMG + 'FONTE_MAXIMUS_ATX_650W_80_PLUSBRONZE.jpg', department: 'hardware', category: 'Fonte' },
  { id: 8, name: 'Fonte de alimentação MSI atx 600W 80 Plus', price: 499.0, image: IMG + 'FONTE_MSI_MAG_600W_80_PLUS.jpg', department: 'hardware', category: 'Fonte' },
  { id: 9, name: 'Processador Intel CORE I5 14400F', price: 2600.5, image: IMG + 'PROCESSADOR_INTEL_COREI5_14400F.jpg', department: 'hardware', category: 'Processador' },
  { id: 10, name: 'Processador AMD Ryzen 5 5600GT', price: 899.0, image: IMG + 'PROCESSADOR_AMD_5_5600GT.jpg', department: 'hardware', category: 'Processador' },
  { id: 11, name: 'Placa de vídeo RTX 3050 6GB GALAX', price: 1460.0, image: IMG + 'PLACADEVIDEO_RTX3050_6GB_GALAX.jpg', department: 'hardware', category: 'Placa de vídeo' },
  { id: 12, name: 'Placa de vídeo RTX 5060 8GB MSI', price: 2151.0, image: IMG + 'PLACADEVIDEO_RTX5060_8GB_MSI.jpg', department: 'hardware', category: 'Placa de vídeo' },
  { id: 13, name: 'Placa de vídeo RX580 8GB AMD', price: 799.99, image: IMG + 'PLACADEVIDEO_RX580_8GB_AMD.jpg', department: 'hardware', category: 'Placa de vídeo' },
  { id: 14, name: 'Monitor Gamer LG UltraGear, 27 Pol, OLED, QHD, 0.03ms, 240Hz, G-Sync/FreeSync Premium Pro, HDMI/DP', price: 5499.99, image: IMG + 'MonitorGamerLGUltraGear,27Pol.jpg', department: 'monitores', category: 'Monitor' },
  { id: 15, name: 'Monitor Gamer AOC Agon CS2 25, 24.5 Pol, IPS, FHD, 0.3ms, 310Hz, G-Sync, HDMI/DP, CS25G', price: 1899.99, image: IMG + 'MonitorGamerAOCAgon.jpg', department: 'monitores', category: 'Monitor' },
  { id: 16, name: 'Monitor Gamer Samsung Odyssey G9, 49 Pol, VA, DQHD, Curvo, 1ms, 144Hz, FreeSync Premium Pro, HDMI/DP', price: 7249.99, image: IMG + 'MonitorGamerSamsungOdysseyG9.jpg', department: 'monitores', category: 'Monitor' },
  { id: 17, name: 'Monitor Gamer Cooler Master GA22FC, 21.45 Pol, VA, FHD, 1ms, 100Hz, Adaptive Sync, HDMI/VGA', price: 449.99, image: IMG + 'MonitorGamerCoolerMasterGA22FC.jpg', department: 'monitores', category: 'Monitor' },
  { id: 18, name: 'Monitor Gamer Pichau Cepheus V4S, 32 Pol, VA, 2K, 1ms, 165Hz, HDMI/DP', price: 1099.99, image: IMG + 'MonitorGamerPichauCepheusV4S.jpg', department: 'monitores', category: 'Monitor' },
  { id: 19, name: 'Monitor Gamer Mancer Valak ZX181, 27 Pol, VA, Curvo, FHD, 1ms, 180Hz, FreeSync, HDMI/DP', price: 789.99, image: IMG + 'MonitorGamerMancerValakZX181.jpg', department: 'monitores', category: 'Monitor' },
  { id: 20, name: 'Monitor Gamer AOC 27G2S, 27 Pol, VA, FHD, 1ms, 165Hz, FreeSync Premium, HDMI/DP', price: 899.99, image: IMG + 'MonitorGamerAOC27G2S.jpg', department: 'monitores', category: 'Monitor' },
  { id: 21, name: 'Pichau Kit upgrade, AMD Ryzen 5 5500X3D, A520M DDR4', price: 1289.18, image: IMG + 'KIT_UPGRADE_AMD_5500_A520M.jpg', department: 'kit-upgrade', category: 'Kit Upgrade' },
  { id: 22, name: 'Pichau Kit Upgrade, Intel Core Ultra 7 265KF, B860M DDR5, 16GB', price: 3799.99, image: IMG + 'PichauKitUpgradeIntelCoreUltra7265KFB860MDDR516GB.jpg', department: 'kit-upgrade', category: 'Kit Upgrade' },
  { id: 23, name: 'Pichau Kit upgrade, Intel i7-12700KF, B760M DDR4, 16GB', price: 2269.99, image: IMG + 'PichauKitupgradeInteli7-12700KFB760MDDR416GB.jpg', department: 'kit-upgrade', category: 'Kit Upgrade' },
  { id: 24, name: 'PC Pichau Lechies, Intel i5-8400, UHD Intel 630, 8GB DDR4, SSD 240GB', price: 1213.01, image: IMG + 'PCPichauLechiesInteli5-8400UHDIntel6308GBDDR4,SSD240GB.jpg', department: 'computadores', category: 'Computador' },
  { id: 25, name: 'PC Gamer Pichau Crisipo IV, AMD Ryzen 5 5600X, Radeon RX 9060 8GB, 16GB DDR4, SSD M.2 1TB', price: 4490.82, image: IMG + 'PCGamerPichauCrisipoIVAMDRyzen55600X,RadeonRX90608GB,16GBDDR4,SSDM.21TB.jpg', department: 'computadores', category: 'Computador' },
  { id: 26, name: 'PC Gamer Pichau Luwu III, Intel i7-12700K, GeForce RTX 4070 Super 12GB, 16GB DDR5, SSD M.2 1TB', price: 9259.49, image: IMG + 'PCGamerPichauLuwuIIIInteli7-12700KGeForceRTX4070Super12GB16GBDDR5SSDM.21TB.jpg', department: 'computadores', category: 'Computador' },
  { id: 27, name: 'PC Pichau Gamer Afrodite, AMD Ryzen 7 5700X, GeForce RTX 5060 8GB, 16GB DDR4, SSD M.2 1TB', price: 5199.99, image: IMG + 'PCPichauGamerAfroditeAMDRyzen75700XGeForceRTX50608GB16GBDDR4SSDM.21TB.jpg', department: 'computadores', category: 'Computador' }
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getAll(): Product[] {
    return PRODUCTS;
  }

  getById(id: number): Product | undefined {
    return PRODUCTS.find((p) => p.id === id);
  }

  getDepartment(slug: string | null | undefined): Department | undefined {
    return DEPARTMENTS.find((d) => d.slug === slug);
  }

  countByDepartment(slug: DepartmentSlug): number {
    return PRODUCTS.filter((p) => p.department === slug).length;
  }

  /** Busca por texto (nome ou categoria, sem diferenciar acentos) e/ou departamento. */
  search(query: string, department?: DepartmentSlug): Product[] {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return PRODUCTS.filter((p) => {
      if (department && p.department !== department) return false;
      if (!terms.length) return true;
      const haystack = normalize(`${p.name} ${p.category}`);
      return terms.every((t) => haystack.includes(t));
    });
  }

  related(product: Product, limit = 4): Product[] {
    return PRODUCTS.filter((p) => p.department === product.department && p.id !== product.id).slice(0, limit);
  }
}

function normalize(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}
