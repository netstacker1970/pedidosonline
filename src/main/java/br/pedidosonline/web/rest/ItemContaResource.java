package br.pedidosonline.web.rest;

import br.pedidosonline.domain.ItemConta;
import br.pedidosonline.repository.ItemContaRepository;
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
 * REST controller for managing {@link br.pedidosonline.domain.ItemConta}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItemContaResource {

    private final Logger log = LoggerFactory.getLogger(ItemContaResource.class);

    private static final String ENTITY_NAME = "itemConta";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItemContaRepository itemContaRepository;

    public ItemContaResource(ItemContaRepository itemContaRepository) {
        this.itemContaRepository = itemContaRepository;
    }

    /**
     * {@code POST  /item-contas} : Create a new itemConta.
     *
     * @param itemConta the itemConta to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itemConta, or with status {@code 400 (Bad Request)} if the itemConta has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/item-contas")
    public ResponseEntity<ItemConta> createItemConta(@RequestBody ItemConta itemConta) throws URISyntaxException {
        log.debug("REST request to save ItemConta : {}", itemConta);
        if (itemConta.getId() != null) {
            throw new BadRequestAlertException("A new itemConta cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItemConta result = itemContaRepository.save(itemConta);
        return ResponseEntity
            .created(new URI("/api/item-contas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /item-contas/:id} : Updates an existing itemConta.
     *
     * @param id the id of the itemConta to save.
     * @param itemConta the itemConta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemConta,
     * or with status {@code 400 (Bad Request)} if the itemConta is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itemConta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/item-contas/{id}")
    public ResponseEntity<ItemConta> updateItemConta(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItemConta itemConta
    ) throws URISyntaxException {
        log.debug("REST request to update ItemConta : {}, {}", id, itemConta);
        if (itemConta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemConta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemContaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ItemConta result = itemContaRepository.save(itemConta);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, itemConta.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /item-contas/:id} : Partial updates given fields of an existing itemConta, field will ignore if it is null
     *
     * @param id the id of the itemConta to save.
     * @param itemConta the itemConta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemConta,
     * or with status {@code 400 (Bad Request)} if the itemConta is not valid,
     * or with status {@code 404 (Not Found)} if the itemConta is not found,
     * or with status {@code 500 (Internal Server Error)} if the itemConta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/item-contas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ItemConta> partialUpdateItemConta(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItemConta itemConta
    ) throws URISyntaxException {
        log.debug("REST request to partial update ItemConta partially : {}, {}", id, itemConta);
        if (itemConta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemConta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemContaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ItemConta> result = itemContaRepository
            .findById(itemConta.getId())
            .map(existingItemConta -> {
                if (itemConta.getValorConta() != null) {
                    existingItemConta.setValorConta(itemConta.getValorConta());
                }

                return existingItemConta;
            })
            .map(itemContaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, itemConta.getId().toString())
        );
    }

    /**
     * {@code GET  /item-contas} : get all the itemContas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itemContas in body.
     */
    @GetMapping("/item-contas")
    public List<ItemConta> getAllItemContas() {
        log.debug("REST request to get all ItemContas");
        return itemContaRepository.findAll();
    }

    /**
     * {@code GET  /item-contas/:id} : get the "id" itemConta.
     *
     * @param id the id of the itemConta to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itemConta, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/item-contas/{id}")
    public ResponseEntity<ItemConta> getItemConta(@PathVariable Long id) {
        log.debug("REST request to get ItemConta : {}", id);
        Optional<ItemConta> itemConta = itemContaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(itemConta);
    }

    /**
     * {@code DELETE  /item-contas/:id} : delete the "id" itemConta.
     *
     * @param id the id of the itemConta to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/item-contas/{id}")
    public ResponseEntity<Void> deleteItemConta(@PathVariable Long id) {
        log.debug("REST request to delete ItemConta : {}", id);
        itemContaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
