package br.pedidosonline.repository;

import br.pedidosonline.domain.ItemCardapio;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ItemCardapio entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItemCardapioRepository extends JpaRepository<ItemCardapio, Long> {}
