package br.pedidosonline.web.rest;

import br.pedidosonline.domain.Caixa;
import br.pedidosonline.repository.CaixaRepository;
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
 * REST controller for managing {@link br.pedidosonline.domain.Caixa}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CaixaResource {

    private final Logger log = LoggerFactory.getLogger(CaixaResource.class);

    private static final String ENTITY_NAME = "caixa";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CaixaRepository caixaRepository;

    public CaixaResource(CaixaRepository caixaRepository) {
        this.caixaRepository = caixaRepository;
    }

    /**
     * {@code POST  /caixas} : Create a new caixa.
     *
     * @param caixa the caixa to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new caixa, or with status {@code 400 (Bad Request)} if the caixa has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/caixas")
    public ResponseEntity<Caixa> createCaixa(@RequestBody Caixa caixa) throws URISyntaxException {
        log.debug("REST request to save Caixa : {}", caixa);
        if (caixa.getId() != null) {
            throw new BadRequestAlertException("A new caixa cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Caixa result = caixaRepository.save(caixa);
        return ResponseEntity
            .created(new URI("/api/caixas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /caixas/:id} : Updates an existing caixa.
     *
     * @param id the id of the caixa to save.
     * @param caixa the caixa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated caixa,
     * or with status {@code 400 (Bad Request)} if the caixa is not valid,
     * or with status {@code 500 (Internal Server Error)} if the caixa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/caixas/{id}")
    public ResponseEntity<Caixa> updateCaixa(@PathVariable(value = "id", required = false) final Long id, @RequestBody Caixa caixa)
        throws URISyntaxException {
        log.debug("REST request to update Caixa : {}, {}", id, caixa);
        if (caixa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, caixa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!caixaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Caixa result = caixaRepository.save(caixa);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, caixa.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /caixas/:id} : Partial updates given fields of an existing caixa, field will ignore if it is null
     *
     * @param id the id of the caixa to save.
     * @param caixa the caixa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated caixa,
     * or with status {@code 400 (Bad Request)} if the caixa is not valid,
     * or with status {@code 404 (Not Found)} if the caixa is not found,
     * or with status {@code 500 (Internal Server Error)} if the caixa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/caixas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Caixa> partialUpdateCaixa(@PathVariable(value = "id", required = false) final Long id, @RequestBody Caixa caixa)
        throws URISyntaxException {
        log.debug("REST request to partial update Caixa partially : {}, {}", id, caixa);
        if (caixa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, caixa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!caixaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Caixa> result = caixaRepository
            .findById(caixa.getId())
            .map(existingCaixa -> {
                if (caixa.getSaldoinicio() != null) {
                    existingCaixa.setSaldoinicio(caixa.getSaldoinicio());
                }
                if (caixa.getSaldoFim() != null) {
                    existingCaixa.setSaldoFim(caixa.getSaldoFim());
                }
                if (caixa.getDtAbertura() != null) {
                    existingCaixa.setDtAbertura(caixa.getDtAbertura());
                }
                if (caixa.getDtFechamento() != null) {
                    existingCaixa.setDtFechamento(caixa.getDtFechamento());
                }
                if (caixa.getValor() != null) {
                    existingCaixa.setValor(caixa.getValor());
                }

                return existingCaixa;
            })
            .map(caixaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, caixa.getId().toString())
        );
    }

    /**
     * {@code GET  /caixas} : get all the caixas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of caixas in body.
     */
    @GetMapping("/caixas")
    public List<Caixa> getAllCaixas() {
        log.debug("REST request to get all Caixas");
        return caixaRepository.findAll();
    }

    /**
     * {@code GET  /caixas/:id} : get the "id" caixa.
     *
     * @param id the id of the caixa to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the caixa, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/caixas/{id}")
    public ResponseEntity<Caixa> getCaixa(@PathVariable Long id) {
        log.debug("REST request to get Caixa : {}", id);
        Optional<Caixa> caixa = caixaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(caixa);
    }

    /**
     * {@code DELETE  /caixas/:id} : delete the "id" caixa.
     *
     * @param id the id of the caixa to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/caixas/{id}")
    public ResponseEntity<Void> deleteCaixa(@PathVariable Long id) {
        log.debug("REST request to delete Caixa : {}", id);
        caixaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
