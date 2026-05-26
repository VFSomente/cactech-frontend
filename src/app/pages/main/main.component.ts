import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { ToastService } from '../services/toast/toast.service';
import { AuthService } from '../services/auth/auth.service';
import { UserProfile, UserService } from '../services/user/user.service';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor(
    private router: Router,
    private cartService: CartService,
    private toastService: ToastService,
    private authService: AuthService,
    private userService: UserService
  ) {}

    cartCount = 0;
    favorites: any[] = [];
    currentUser: UserProfile | null = null;
    dropdownOpen = false;

    ngOnInit(): void {
    // LÓGICA CARRINHO ESCUTA ADIÇÕES AO CARRINHO // LÓGICA FAVORITOS ESCUTA ADIÇÕES AOS FAVORITOS
    this.loadFavorites();
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.userService.refreshMeIfToken(this.authService.getToken());
  }
    countProduct(productId: number) {
    const product = this.Products.find(p => p.id === productId);
    if (product) {
      this.cartService.addToCart(product);
    }
  }
    // // // // // // // // // // // // // // // // // // // // // // // // // // //

    // ANIMAÇÃO BANNER SLIDER
    ngAfterViewInit(): void {
  const slides = document.querySelectorAll<HTMLInputElement>('input[name="hero"]');
  let index = 0;

  setInterval(() => {
    index = (index + 1) % slides.length;
    slides[index].checked = true;
  }, 5000); // troca a cada 5 segundos
}
   // // // // // // // // // // // // // // // // // // // // // // // // // // //
 // 🔹 Carrega favoritos do localStorage
  loadFavorites(): void {
    const stored = localStorage.getItem('favorites');
    this.favorites = stored ? JSON.parse(stored) : [];
  }

  // 🔹 Verifica se produto já é favorito
  isFavorite(productId: number): boolean {
    return this.favorites.some(p => p.id === productId);
  }

  // 🔹 Adiciona ou remove produto dos favoritos
  toggleFavorite(product: any): void {
    const index = this.favorites.findIndex(p => p.id === product.id);

    if (index > -1) {
      // remove
      this.favorites.splice(index, 1);
    } else {
      // adiciona
      this.favorites.push(product);
    }

    // atualiza localStorage
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

    // // // // // // // // // // // // // // // // // // // // // // // // // // //

    // LÓGICA NAVEGAÇÃO PELO MENU INICIAL DO SITE 
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  navigateToProfile() {
    this.dropdownOpen = false;
    this.router.navigate(['/profile']);
  }
  toggleUserMenu() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  logout() {
    this.authService.clearToken();
    this.userService.clearCurrentUser();
    this.dropdownOpen = false;
    this.router.navigate(['/']);
  }
  get userDisplayName(): string {
    if (!this.currentUser) return '';
    return this.currentUser.nome || this.currentUser.nomeCompleto || this.currentUser.username || 'Conta';
  }
  get userAvatar(): string {
    return this.currentUser?.avatarUrl || '';
  }
  get isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }
  navigateToFavorites() {
    this.router.navigate(['/favorites']);
  }
     viewProduct(id: number) {
    this.router.navigate(['/product', id]);
  }

  goToCart() {
  this.router.navigate(['/cart']);
}
  openProduct(productId: number): void {
    // exemplo: redireciona para a página do produto
    this.router.navigate(['/product', productId]);
  }
    // // // // // // // // // // // // // // // // // // // // // // // // // // //

    // DICIONÁRIO DE PRODUTOS DA LOJA 
  Products = [
    {
      id: 0,
      name: 'Placa mãe AsRock X870 Pro',
      price: 1760.72,
      image: '../../../assets/products/ASROCK_PLACAMAE_X870_PRO.jpg'
    },
    {
      id: 1,
      name: 'Placa mãe GIGABYTE A520M',
      price: 444.00,
      image: '../../../assets/products/PLACAMAE_GIGABYTE_A520M.jpg'
    },
    {
      id: 2,
      name: 'Placa mãe MSI A520-A Pro',
      price: 443.64,
      image: '../../../assets/products/PLACAMAE_MSI_A520-A_PRO.jpg'
    },
    {
      id: 3,
      name: 'Memória XPG Spectrix RGB 16GB DDR4 3200Mhz',
      price: 447.90,
      image: '../../../assets/products/MEMÓRIA_RAM_XPG_SPECTRIX_RGB_16GB_DDR4_3200MHZ.jpg'
    },
    {
      id: 4,
      name: 'Memória Corsair VENGEANCE RGB 32GB DDR5',
      price: 810.00,
      image: '../../../assets/products/CORSAIR_VENGEANCE_RGB_DDR5_RAM_32GB.jpg'
    },
    {
      id: 5,
      name: 'Memória FURY Beast 16GB DDR4 3200Mhz ',
      price: 469.99,
      image: '../../../assets/products/MEMÓRIA_RAM_16GB_DDR4_3200MHZ_FURY_BEAST.jpg'
    },
    {
      id: 6,
      name: 'Fonte de alimentação Corsair atx 650W 80 Plus Bronze',
      price: 455.99,
      image: '../../../assets/products/FONTE_CORSAIR_ATX_650W_80_PLUSBRONZE.jpg'
    },
    {
      id: 7,
      name: 'Fonte de alimentação Maximus atx 650W 80 Plus Bronze',
      price: 319.99,
      image: '../../../assets/products/FONTE_MAXIMUS_ATX_650W_80_PLUSBRONZE.jpg'
    },
    {
      id: 8,
      name: 'Fonte de alimentação MSI atx 600W 80 Plus',
      price: 499.00,
      image: '../../../assets/products/FONTE_MSI_MAG_600W_80_PLUS.jpg'
    },
    {
      id: 9,
      name: 'Processador Intel CORE I5 14400F',
      price: 2600.50,
      image: '../../../assets/products/PROCESSADOR_INTEL_COREI5_14400F.jpg'
    },
    {
      id: 10,
      name: 'Processador AMD Ryzen 5 5600GT',
      price: 899.00,
      image: '../../../assets/products/PROCESSADOR_AMD_5_5600GT.jpg'
    },
    {
      id: 11,
      name: 'Placa de vídeo RTX 3050 6GB GALAX',
      price: 1460.00,
      image: '../../../assets/products/PLACADEVIDEO_RTX3050_6GB_GALAX.jpg'
    },
    {
      id: 12,
      name: 'Placa de vídeo RTX 5060 8GB MSI',
      price: 2151.00,
      image: '../../../assets/products/PLACADEVIDEO_RTX5060_8GB_MSI.jpg'
    },
    {
      id: 13,
      name: 'Placa de vídeo RX580 8GB AMD',
      price: 799.99,
      image: '../../../assets/products/PLACADEVIDEO_RX580_8GB_AMD.jpg'
    },
        {
      id: 14,
      name: 'Monitor Gamer LG UltraGear, 27 Pol, OLED, QHD, 0.03ms, 240Hz, G-Sync/FreeSync Premium Pro, HDMI/DP, ',
      price: 5499.99,
      image: '../../../assets/products/MonitorGamerLGUltraGear,27Pol.jpg'
    },
        {
      id: 15,
      name: 'Monitor Gamer AOC Agon CS2 25, 24.5 Pol, IPS, FHD, 0.3ms, 310Hz, G-Sync, HDMI/DP, CS25G',
      price: 1899.99,
      image: '../../../assets/products/MonitorGamerAOCAgon.jpg'
    },
        {
      id: 16,
      name: 'Monitor Gamer Samsung Odyssey G9, 49 Pol, VA, DQHD, Curvo, 1ms, 144Hz, FreeSync Premium Pro, HDMI/DP',
      price: 7249.99,
      image: '../../../assets/products/MonitorGamerSamsungOdysseyG9.jpg'
    },
        {
      id: 17,
      name: 'Monitor Gamer Cooler Master GA22FC, 21.45 Pol, VA, FHD, 1ms, 100Hz, Adaptive Sync, HDMI/VGA',
      price: 449.99,
      image: '../../../assets/products/MonitorGamerCoolerMasterGA22FC.jpg'
    },
        {
      id: 18,
      name: 'Monitor Gamer Pichau Cepheus V4S, 32 Pol, VA, 2K, 1ms, 165Hz, HDMI/DP',
      price: 1099.99,
      image: '../../../assets/products/MonitorGamerPichauCepheusV4S.jpg'
    },
        {
      id: 19,
      name: 'Monitor Gamer Mancer Valak ZX181, 27 Pol, VA, Curvo, FHD, 1ms, 180Hz, FreeSync, HDMI/DP',
      price: 789.99,
      image: '../../../assets/products/MonitorGamerMancerValakZX181.jpg'
    },
        {
      id: 20,
      name: 'Monitor Gamer AOC 27G2S, 27 Pol, VA, FHD, 1ms, 165Hz, FreeSync Premium, HDMI/DP',
      price: 899.99,
      image: '../../../assets/products/MonitorGamerAOC27G2S.jpg'
    },
        {
      id: 21,
      name: 'Pichau Kit upgrade, AMD Ryzen 5 5500X3D, A520M DDR4',
      price: 1289.18,
      image: '../../../assets/products/KIT_UPGRADE_AMD_5500_A520M.jpg'
    },
        {
      id: 22,
      name: 'Pichau Kit Upgrade, Intel Core Ultra 7 265KF, B860M DDR5, 16GB',
      price: 3799.99,
      image: '../../../assets/products/PichauKitUpgradeIntelCoreUltra7265KFB860MDDR516GB.jpg'
    },
        {
      id: 23,
      name: 'Pichau Kit upgrade, Intel i7-12700KF, B760M DDR4, 16GB',
      price: 2269.99,
      image: '../../../assets/products/PichauKitupgradeInteli7-12700KFB760MDDR416GB.jpg'
    },
        {
      id: 24,
      name: 'PC Pichau Lechies, Intel i5-8400, UHD Intel 630, 8GB DDR4, SSD 240GB',
      price: 1213.01,
      image: '../../../assets/products/PCPichauLechiesInteli5-8400UHDIntel6308GBDDR4,SSD240GB.jpg'
    },
        {
      id: 25,
      name: 'PC Gamer Pichau Crisipo IV, AMD Ryzen 5 5600X, Radeon RX 9060 8GB, 16GB DDR4, SSD M.2 1TB ',
      price: 4490.82,
      image: '../../../assets/products/PCGamerPichauCrisipoIVAMDRyzen55600X,RadeonRX90608GB,16GBDDR4,SSDM.21TB.jpg'
    },
        {
      id: 26,
      name: 'PC Gamer Pichau Luwu III, Intel i7-12700K, GeForce RTX 4070 Super 12GB, 16GB DDR5, SSD M.2 1TB',
      price: 9259.49,
      image: '../../../assets/products/PCGamerPichauLuwuIIIInteli7-12700KGeForceRTX4070Super12GB16GBDDR5SSDM.21TB.jpg'
    },
        {
      id: 27,
      name: 'PC Pichau Gamer Afrodite, AMD Ryzen 7 5700X, GeForce RTX 5060 8GB, 16GB DDR4, SSD M.2 1TB',
      price: 5199.99,
      image: '../../../assets/products/PCPichauGamerAfroditeAMDRyzen75700XGeForceRTX50608GB16GBDDR4SSDM.21TB.jpg'
    },
    
  ];
      // // // // // // // // // // // // // // // // // // // // // // // // // // //
  }

