package br.pedidosonline.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.pedidosonline.IntegrationTest;
import br.pedidosonline.domain.ItemConta;
import br.pedidosonline.repository.ItemContaRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ItemContaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItemContaResourceIT {

    private static final Float DEFAULT_VALOR_CONTA = 1F;
    private static final Float UPDATED_VALOR_CONTA = 2F;

    private static final String ENTITY_API_URL = "/api/item-contas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItemContaRepository itemContaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItemContaMockMvc;

    private ItemConta itemConta;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemConta createEntity(EntityManager em) {
        ItemConta itemConta = new ItemConta().valorConta(DEFAULT_VALOR_CONTA);
        return itemConta;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemConta createUpdatedEntity(EntityManager em) {
        ItemConta itemConta = new ItemConta().valorConta(UPDATED_VALOR_CONTA);
        return itemConta;
    }

    @BeforeEach
    public void initTest() {
        itemConta = createEntity(em);
    }

    @Test
    @Transactional
    void createItemConta() throws Exception {
        int databaseSizeBeforeCreate = itemContaRepository.findAll().size();
        // Create the ItemConta
        restItemContaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemConta)))
            .andExpect(status().isCreated());

        // Validate the ItemConta in the database
        List<ItemConta> itemContaList = itemContaRepository.findAll();
        assertThat(itemContaList).hasSize(databaseSizeBeforeCreate + 1);
        ItemConta testItemConta = itemContaList.get(itemContaList.size() - 1);
        assertThat(testItemConta.getValorConta()).isEqualTo(DEFAULT_VALOR_CONTA);
    }

    @Test
    @Transactional
    void createItemContaWithExistingId() throws Exception {
        // Create the ItemConta with an existing ID
        itemConta.setId(1L);

        int databaseSizeBeforeCreate = itemContaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItemContaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemConta)))
            .andExpect(status().isBadRequest());

        // Validate the ItemConta in the database
        List<ItemConta> itemContaList = itemContaRepository.findAll();
        assertThat(itemContaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItemContas() throws Exception {
        // Initialize the database
        itemContaRepository.saveAndFlush(itemConta);

        // Get all the itemContaList
        restItemContaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itemConta.getId().intValue())))
            .andExpect(jsonPath("$.[*].valorConta").value(hasItem(DEFAULT_VALOR_CONTA.doubleValue())));
    }

    @Test
    @Transactional
    void getItemConta() throws Exception {
        // Initialize the database
        itemContaRepository.saveAndFlush(itemConta);

        // Get the itemConta
        restItemContaMockMvc
            .perform(get(ENTITY_API_URL_ID, itemConta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itemConta.getId().intValue()))
            .andExpect(jsonPath("$.valorConta").value(DEFAULT_VALOR_CONTA.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingItemConta() throws Exception {
        // Get the itemConta
        restItemContaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItemConta() throws Exception {
        // Initialize the database
        itemContaRepository.saveAndFlush(itemConta);

        int databaseSizeBeforeUpdate = itemContaRepository.findAll().size();

        // Update the itemConta
        ItemConta updatedItemConta = itemContaRepository.findById(itemConta.getId()).get();
        // Disconnect from session so that the updates on updatedItemConta are not directly saved in db
        em.detach(updatedItemConta);
        updatedItemConta.valorConta(UPDATED_VALOR_CONTA);

        restItemContaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItemConta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItemConta))
            )
            .andExpect(status().isOk());

        // Validate the ItemConta in the database
        List<ItemConta> itemContaList = itemContaRepository.findAll();
        assertThat(itemContaList).hasSize(databaseSizeBeforeUpdate);
        ItemConta testItemConta = itemContaList.get(itemContaList.size() - 1);
        assertThat(testItemConta.getValorConta()).isEqualTo(UPDATED_VALOR_CONTA);
    }

    @Test
    @Transactional
    void putNonExistingItemConta() throws Exception {
        int databaseSizeBeforeUpdate = itemContaRepository.findAll().size();
        itemConta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemContaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itemConta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemConta))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemConta in the database
        List<ItemConta> itemContaList = itemContaRepository.findAll();
        assertThat(itemContaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItemConta() throws Exception {
        int databaseSizeBeforeUpdate = itemContaRepository.findAll().size();
        itemConta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemContaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemConta))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemConta in the database
        List<ItemConta> itemContaList = itemContaRepository.findAll();
        assertThat(itemContaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItemConta() throws Exception {
        int databaseSizeBeforeUpdate = itemContaRepository.findAll().size();
        itemConta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemContaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemConta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemConta in the database
        List<ItemConta> itemContaList = itemContaRepository.findAll();
        assertThat(itemContaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItemContaWithPatch() throws Exception {
        // Initialize the database
        itemContaRepository.saveAndFlush(itemConta);

        int databaseSizeBeforeUpdate = itemContaRepository.findAll().size();

        // Update the itemConta using partial update
        ItemConta partialUpdatedItemConta = new ItemConta();
        partialUpdatedItemConta.setId(itemConta.getId());

        restItemContaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemConta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemConta))
            )
            .andExpect(status().isOk());

        // Validate the ItemConta in the database
        List<ItemConta> itemContaList = itemContaRepository.findAll();
        assertThat(itemContaList).hasSize(databaseSizeBeforeUpdate);
        ItemConta testItemConta = itemContaList.get(itemContaList.size() - 1);
        assertThat(testItemConta.getValorConta()).isEqualTo(DEFAULT_VALOR_CONTA);
    }

    @Test
    @Transactional
    void fullUpdateItemContaWithPatch() throws Exception {
        // Initialize the database
        itemContaRepository.saveAndFlush(itemConta);

        int databaseSizeBeforeUpdate = itemContaRepository.findAll().size();

        // Update the itemConta using partial update
        ItemConta partialUpdatedItemConta = new ItemConta();
        partialUpdatedItemConta.setId(itemConta.getId());

        partialUpdatedItemConta.valorConta(UPDATED_VALOR_CONTA);

        restItemContaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemConta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemConta))
            )
            .andExpect(status().isOk());

        // Validate the ItemConta in the database
        List<ItemConta> itemContaList = itemContaRepository.findAll();
        assertThat(itemContaList).hasSize(databaseSizeBeforeUpdate);
        ItemConta testItemConta = itemContaList.get(itemContaList.size() - 1);
        assertThat(testItemConta.getValorConta()).isEqualTo(UPDATED_VALOR_CONTA);
    }

    @Test
    @Transactional
    void patchNonExistingItemConta() throws Exception {
        int databaseSizeBeforeUpdate = itemContaRepository.findAll().size();
        itemConta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemContaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itemConta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemConta))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemConta in the database
        List<ItemConta> itemContaList = itemContaRepository.findAll();
        assertThat(itemContaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItemConta() throws Exception {
        int databaseSizeBeforeUpdate = itemContaRepository.findAll().size();
        itemConta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemContaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemConta))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemConta in the database
        List<ItemConta> itemContaList = itemContaRepository.findAll();
        assertThat(itemContaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItemConta() throws Exception {
        int databaseSizeBeforeUpdate = itemContaRepository.findAll().size();
        itemConta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemContaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(itemConta))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemConta in the database
        List<ItemConta> itemContaList = itemContaRepository.findAll();
        assertThat(itemContaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItemConta() throws Exception {
        // Initialize the database
        itemContaRepository.saveAndFlush(itemConta);

        int databaseSizeBeforeDelete = itemContaRepository.findAll().size();

        // Delete the itemConta
        restItemContaMockMvc
            .perform(delete(ENTITY_API_URL_ID, itemConta.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItemConta> itemContaList = itemContaRepository.findAll();
        assertThat(itemContaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
