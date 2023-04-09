package br.pedidosonline.repository;

import br.pedidosonline.domain.Cardapio;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Cardapio entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CardapioRepository extends JpaRepository<Cardapio, Long> {}
