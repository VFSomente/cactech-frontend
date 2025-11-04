import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  featuredProducts = [
    {
      name: 'Placa mãe AsRock X870 Pro',
      price: 1760.72,
      image: '../../../assets/products/ASROCK_PLACAMAE_X870_PRO.jpg'
    },
    {
      name: 'Placa mãe GIGABYTE A520M',
      price: 444.00,
      image: '../../../assets/products/PLACAMAE_GIGABYTE_A520M.jpg'
    },
    {
      name: 'Placa mãe MSI A520-A Pro',
      price: 443.64,
      image: '../../../assets/products/PLACAMAE_MSI_A520-A_PRO.jpg'
    },
    {
      name: 'Memória XPG Spectrix RGB 16GB DDR4 3200Mhz',
      price: 447.90,
      image: '../../../assets/products/MEMÓRIA_RAM_XPG_SPECTRIX_RGB_16GB_DDR4_3200MHZ.jpg'
    },
    {
      name: 'Memória Corsair VENGEANCE RGB 32GB DDR5',
      price: 810.00,
      image: '../../../assets/products/CORSAIR_VENGEANCE_RGB_DDR5_RAM_32GB.jpg'
    },
    {
      name: 'Memória FURY Beast 16GB DDR4 3200Mhz ',
      price: 469.99,
      image: '../../../assets/products/MEMÓRIA_RAM_16GB_DDR4_3200MHZ_FURY_BEAST.jpg'
    },
    {
      name: 'Fonte de alimentação Corsair atx 650W 80 Plus Bronze',
      price: 455.99,
      image: '../../../assets/products/FONTE_CORSAIR_ATX_650W_80_PLUSBRONZE.jpg'
    },
    {
      name: 'Fonte de alimentação Maximus atx 650W 80 Plus Bronze',
      price: 319.99,
      image: '../../../assets/products/FONTE_MAXIMUS_ATX_650W_80_PLUSBRONZE.jpg'
    },
    {
      name: 'Fonte de alimentação MSI atx 600W 80 Plus',
      price: 499.00,
      image: '../../../assets/products/FONTE_MSI_MAG_600W_80_PLUS.jpg'
    },
    {
      name: 'Processador Intel CORE I5 14400F',
      price: 2600.50,
      image: '../../../assets/products/PROCESSADOR_INTEL_COREI5_14400F.jpg'
    },
    {
      name: 'Processador AMD Ryzen 5 5600GT',
      price: 899.00,
      image: '../../../assets/products/PROCESSADOR_AMD_5_5600GT.jpg'
    },
    {
      name: 'Placa de vídeo RTX 3050 6GB GALAX',
      price: 1460.00,
      image: '../../../assets/products/PLACADEVIDEO_RTX3050_6GB_GALAX.jpg'
    },
    {
      name: 'Placa de vídeo RTX 5060 8GB MSI',
      price: 2151.00,
      image: '../../../assets/products/PLACADEVIDEO_RTX5060_8GB_MSI.jpg'
    },
    {
      name: 'Placa de vídeo RX580 8GB AMD',
      price: 799.99,
      image: '../../../assets/products/PLACADEVIDEO_RX580_8GB_AMD.jpg'
    },
  ];
}
