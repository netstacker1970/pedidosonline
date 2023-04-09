package br.pedidosonline.web.rest;

import br.pedidosonline.domain.Conta;
import br.pedidosonline.repository.ContaRepository;
import br.pedidosonline.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.pedidosonline.domain.Conta}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ContaResource {

    private final Logger log = LoggerFactory.getLogger(ContaResource.class);

    private static final String ENTITY_NAME = "conta";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContaRepository contaRepository;

    public ContaResource(ContaRepository contaRepository) {
        this.contaRepository = contaRepository;
    }

    /**
     * {@code POST  /contas} : Create a new conta.
     *
     * @param conta the conta to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new conta, or with status {@code 400 (Bad Request)} if the conta has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/contas")
    public ResponseEntity<Conta> createConta(@RequestBody Conta conta) throws URISyntaxException {
        log.debug("REST request to save Conta : {}", conta);
        if (conta.getId() != null) {
            throw new BadRequestAlertException("A new conta cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Conta result = contaRepository.save(conta);
        return ResponseEntity
            .created(new URI("/api/contas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /contas/:id} : Updates an existing conta.
     *
     * @param id the id of the conta to save.
     * @param conta the conta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated conta,
     * or with status {@code 400 (Bad Request)} if the conta is not valid,
     * or with status {@code 500 (Internal Server Error)} if the conta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/contas/{id}")
    public ResponseEntity<Conta> updateConta(@PathVariable(value = "id", required = false) final Long id, @RequestBody Conta conta)
        throws URISyntaxException {
        log.debug("REST request to update Conta : {}, {}", id, conta);
        if (conta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, conta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Conta result = contaRepository.save(conta);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, conta.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /contas/:id} : Partial updates given fields of an existing conta, field will ignore if it is null
     *
     * @param id the id of the conta to save.
     * @param conta the conta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated conta,
     * or with status {@code 400 (Bad Request)} if the conta is not valid,
     * or with status {@code 404 (Not Found)} if the conta is not found,
     * or with status {@code 500 (Internal Server Error)} if the conta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/contas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Conta> partialUpdateConta(@PathVariable(value = "id", required = false) final Long id, @RequestBody Conta conta)
        throws URISyntaxException {
        log.debug("REST request to partial update Conta partially : {}, {}", id, conta);
        if (conta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, conta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Conta> result = contaRepository
            .findById(conta.getId())
            .map(existingConta -> {
                if (conta.getDtConta() != null) {
                    existingConta.setDtConta(conta.getDtConta());
                }
                if (conta.getValorConta() != null) {
                    existingConta.setValorConta(conta.getValorConta());
                }

                return existingConta;
            })
            .map(contaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, conta.getId().toString())
        );
    }

    /**
     * {@code GET  /contas} : get all the contas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contas in body.
     */
    @GetMapping("/contas")
    public List<Conta> getAllContas() {
        log.debug("REST request to get all Contas");
        return contaRepository.findAll();
    }

    /**
     * {@code GET  /contas/:id} : get the "id" conta.
     *
     * @param id the id of the conta to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the conta, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/contas/{id}")
    public ResponseEntity<Conta> getConta(@PathVariable Long id) {
        log.debug("REST request to get Conta : {}", id);
        Optional<Conta> conta = contaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(conta);
    }

    /**
     * {@code DELETE  /contas/:id} : delete the "id" conta.
     *
     * @param id the id of the conta to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/contas/{id}")
    public ResponseEntity<Void> deleteConta(@PathVariable Long id) {
        log.debug("REST request to delete Conta : {}", id);
        contaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
