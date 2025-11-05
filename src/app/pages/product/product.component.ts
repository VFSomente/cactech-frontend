import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productId!: number;
  product: any;

   constructor(private route: ActivatedRoute, private router: Router, private cartService: CartService) {}

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.products[this.productId];
  }
  
  addToCart() {
    this.cartService.addToCart(this.product);
    alert(`${this.product.name} foi adicionado ao carrinho 🛒`);
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
  }
}