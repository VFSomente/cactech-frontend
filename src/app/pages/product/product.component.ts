import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { ToastService } from '../services/toast/toast.service';
@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productId!: number;
  product: any;

   constructor(private route: ActivatedRoute, private router: Router, private cartService: CartService, private toastService: ToastService) {}

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.products[this.productId];
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.toastService.show(`${product.name} foi adicionado ao carrinho 🛒`);
    this.router.navigate(['/']); // volta para a página principal
  }

  voltar() {
    this.router.navigate(['/']);
  }
  // Dicionário de produtos
  products: { [key: number]: any } = {

    0: {
      name: 'Placa mãe AsRock X870 Pro',
      descripion: "",
      price: 1760.72,
      image: '../../../assets/products/ASROCK_PLACAMAE_X870_PRO.jpg'
    },
    1: {
      name: 'Placa mãe GIGABYTE A520M',
      descripion: "",
      price: 444.00,
      image: '../../../assets/products/PLACAMAE_GIGABYTE_A520M.jpg'
    },
    2: {
      name: 'Placa mãe MSI A520-A Pro',
      descripion: "",
      price: 443.64,
      image: '../../../assets/products/PLACAMAE_MSI_A520-A_PRO.jpg'
    },
    3: {
      description: "",
      name: 'Memória XPG Spectrix RGB 16GB DDR4 3200Mhz',
      price: 447.90,
      image: '../../../assets/products/MEMÓRIA_RAM_XPG_SPECTRIX_RGB_16GB_DDR4_3200MHZ.jpg'
    },
    4: {
      description: "",
      name: 'Memória Corsair VENGEANCE RGB 32GB DDR5',
      price: 810.00,
      image: '../../../assets/products/CORSAIR_VENGEANCE_RGB_DDR5_RAM_32GB.jpg'
    },
    5: {
      description: "",
      name: 'Memória FURY Beast 16GB DDR4 3200Mhz ',
      price: 469.99,
      image: '../../../assets/products/MEMÓRIA_RAM_16GB_DDR4_3200MHZ_FURY_BEAST.jpg'
    },
    6: {
      description: "",
      name: 'Fonte de alimentação Corsair atx 650W 80 Plus Bronze',
      price: 455.99,
      image: '../../../assets/products/FONTE_CORSAIR_ATX_650W_80_PLUSBRONZE.jpg'
    },
    7: {
      description: "",
      name: 'Fonte de alimentação Maximus atx 650W 80 Plus Bronze',
      price: 319.99,
      image: '../../../assets/products/FONTE_MAXIMUS_ATX_650W_80_PLUSBRONZE.jpg'
    },
    8: {
      description: "",
      name: 'Fonte de alimentação MSI atx 600W 80 Plus',
      price: 499.00,
      image: '../../../assets/products/FONTE_MSI_MAG_600W_80_PLUS.jpg'
    },
    9: {
      description: "",
      name: 'Processador Intel CORE I5 14400F',
      price: 2600.50,
      image: '../../../assets/products/PROCESSADOR_INTEL_COREI5_14400F.jpg'
    },
    10: {
      description: "",
      name: 'Processador AMD Ryzen 5 5600GT',
      price: 899.00,
      image: '../../../assets/products/PROCESSADOR_AMD_5_5600GT.jpg'
    },
    11: {
      description: "",
      name: 'Placa de vídeo RTX 3050 6GB GALAX',
      price: 1460.00,
      image: '../../../assets/products/PLACADEVIDEO_RTX3050_6GB_GALAX.jpg'
    },
    12: {
      description: "",
      name: 'Placa de vídeo RTX 5060 8GB MSI',
      price: 2151.00,
      image: '../../../assets/products/PLACADEVIDEO_RTX5060_8GB_MSI.jpg'
    },
    13: {
      description: "",
      name: 'Placa de vídeo RX580 8GB AMD',
      price: 799.99,
      image: '../../../assets/products/PLACADEVIDEO_RX580_8GB_AMD.jpg'
    },
    14: {
      name: 'Monitor Gamer LG UltraGear, 27 Pol, OLED, QHD, 0.03ms, 240Hz, G-Sync/FreeSync Premium Pro, HDMI/DP, ',
      price: 5499.99,
      image: '../../../assets/products/MonitorGamerLGUltraGear,27Pol.jpg'
    },
    15: {
      name: 'Monitor Gamer AOC Agon CS2 25, 24.5 Pol, IPS, FHD, 0.3ms, 310Hz, G-Sync, HDMI/DP, CS25G',
      price: 1899.99,
      image: '../../../assets/products/MonitorGamerAOCAgon.jpg'
    },
    16: {
      name: 'Monitor Gamer Samsung Odyssey G9, 49 Pol, VA, DQHD, Curvo, 1ms, 144Hz, FreeSync Premium Pro, HDMI/DP',
      price: 7249.99,
      image: '../../../assets/products/MonitorGamerSamsungOdysseyG9.jpg'
    },
    17: {
      name: 'Monitor Gamer Cooler Master GA22FC, 21.45 Pol, VA, FHD, 1ms, 100Hz, Adaptive Sync, HDMI/VGA',
      price: 449.99,
      image: '../../../assets/products/MonitorGamerCoolerMasterGA22FC.jpg'
    },
    18: {
      name: 'Monitor Gamer Pichau Cepheus V4S, 32 Pol, VA, 2K, 1ms, 165Hz, HDMI/DP',
      price: 1099.99,
      image: '../../../assets/products/MonitorGamerPichauCepheusV4S.jpg'
    },
    19: {
      name: 'Monitor Gamer Mancer Valak ZX181, 27 Pol, VA, Curvo, FHD, 1ms, 180Hz, FreeSync, HDMI/DP',
      price: 789.99,
      image: '../../../assets/products/MonitorGamerMancerValakZX181.jpg'
    },
    20: {
      name: 'Monitor Gamer AOC 27G2S, 27 Pol, VA, FHD, 1ms, 165Hz, FreeSync Premium, HDMI/DP',
      price: 899.99,
      image: '../../../assets/products/MonitorGamerAOC27G2S.jpg'
    },
    21: {
      name: 'Pichau Kit upgrade, AMD Ryzen 5 5500X3D, A520M DDR4',
      price: 1289.18,
      image: '../../../assets/products/KIT_UPGRADE_AMD_5500_A520M.jpg'
    },
    22: {
      name: 'Pichau Kit Upgrade, Intel Core Ultra 7 265KF, B860M DDR5, 16GB',
      price: 3799.99,
      image: '../../../assets/products/PichauKitUpgradeIntelCoreUltra7265KFB860MDDR516GB.jpg'
    },
    23: {
      name: 'Pichau Kit upgrade, Intel i7-12700KF, B760M DDR4, 16GB',
      price: 2269.99,
      image: '../../../assets/products/PichauKitupgradeInteli7-12700KFB760MDDR416GB.jpg'
    },
    24: {
      name: 'PC Pichau Lechies, Intel i5-8400, UHD Intel 630, 8GB DDR4, SSD 240GB',
      price: 1213.01,
      image: '../../../assets/products/PCPichauLechiesInteli5-8400UHDIntel6308GBDDR4,SSD240GB.jpg'
    },
    25: {
      name: 'PC Gamer Pichau Crisipo IV, AMD Ryzen 5 5600X, Radeon RX 9060 8GB, 16GB DDR4, SSD M.2 1TB ',
      price: 4490.82,
      image: '../../../assets/products/PCGamerPichauCrisipoIVAMDRyzen55600X,RadeonRX90608GB,16GBDDR4,SSDM.21TB.jpg'
    },
    26: {
      name: 'PC Gamer Pichau Luwu III, Intel i7-12700K, GeForce RTX 4070 Super 12GB, 16GB DDR5, SSD M.2 1TB',
      price: 9259.49,
      image: '../../../assets/products/PCGamerPichauLuwuIIIInteli7-12700KGeForceRTX4070Super12GB16GBDDR5SSDM.21TB.jpg'
    },
    27: {
      name: 'PC Pichau Gamer Afrodite, AMD Ryzen 7 5700X, GeForce RTX 5060 8GB, 16GB DDR4, SSD M.2 1TB',
      price: 5199.99,
      image: '../../../assets/products/PCPichauGamerAfroditeAMDRyzen75700XGeForceRTX50608GB16GBDDR4SSDM.21TB.jpg'
    },
  }
}