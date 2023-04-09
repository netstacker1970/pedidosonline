import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'cliente',
        data: { pageTitle: 'pedidosOnlineApp.cliente.home.title' },
        loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule),
      },
      {
        path: 'caixa',
        data: { pageTitle: 'pedidosOnlineApp.caixa.home.title' },
        loadChildren: () => import('./caixa/caixa.module').then(m => m.CaixaModule),
      },
      {
        path: 'pagamento',
        data: { pageTitle: 'pedidosOnlineApp.pagamento.home.title' },
        loadChildren: () => import('./pagamento/pagamento.module').then(m => m.PagamentoModule),
      },
      {
        path: 'conta',
        data: { pageTitle: 'pedidosOnlineApp.conta.home.title' },
        loadChildren: () => import('./conta/conta.module').then(m => m.ContaModule),
      },
      {
        path: 'item-conta',
        data: { pageTitle: 'pedidosOnlineApp.itemConta.home.title' },
        loadChildren: () => import('./item-conta/item-conta.module').then(m => m.ItemContaModule),
      },
      {
        path: 'cardapio',
        data: { pageTitle: 'pedidosOnlineApp.cardapio.home.title' },
        loadChildren: () => import('./cardapio/cardapio.module').then(m => m.CardapioModule),
      },
      {
        path: 'item-cardapio',
        data: { pageTitle: 'pedidosOnlineApp.itemCardapio.home.title' },
        loadChildren: () => import('./item-cardapio/item-cardapio.module').then(m => m.ItemCardapioModule),
      },
      {
        path: 'produto',
        data: { pageTitle: 'pedidosOnlineApp.produto.home.title' },
        loadChildren: () => import('./produto/produto.module').then(m => m.ProdutoModule),
      },
      {
        path: 'categoria',
        data: { pageTitle: 'pedidosOnlineApp.categoria.home.title' },
        loadChildren: () => import('./categoria/categoria.module').then(m => m.CategoriaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
