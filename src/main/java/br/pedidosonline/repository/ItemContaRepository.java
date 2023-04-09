package br.pedidosonline.repository;

import br.pedidosonline.domain.ItemConta;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ItemConta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItemContaRepository extends JpaRepository<ItemConta, Long> {}
