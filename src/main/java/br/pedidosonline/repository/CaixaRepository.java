package br.pedidosonline.repository;

import br.pedidosonline.domain.Caixa;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Caixa entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CaixaRepository extends JpaRepository<Caixa, Long> {}
