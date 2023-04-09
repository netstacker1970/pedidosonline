package br.pedidosonline.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.pedidosonline.IntegrationTest;
import br.pedidosonline.domain.ItemCardapio;
import br.pedidosonline.repository.ItemCardapioRepository;
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
 * Integration tests for the {@link ItemCardapioResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItemCardapioResourceIT {

    private static final String ENTITY_API_URL = "/api/item-cardapios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItemCardapioRepository itemCardapioRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItemCardapioMockMvc;

    private ItemCardapio itemCardapio;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemCardapio createEntity(EntityManager em) {
        ItemCardapio itemCardapio = new ItemCardapio();
        return itemCardapio;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemCardapio createUpdatedEntity(EntityManager em) {
        ItemCardapio itemCardapio = new ItemCardapio();
        return itemCardapio;
    }

    @BeforeEach
    public void initTest() {
        itemCardapio = createEntity(em);
    }

    @Test
    @Transactional
    void createItemCardapio() throws Exception {
        int databaseSizeBeforeCreate = itemCardapioRepository.findAll().size();
        // Create the ItemCardapio
        restItemCardapioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemCardapio)))
            .andExpect(status().isCreated());

        // Validate the ItemCardapio in the database
        List<ItemCardapio> itemCardapioList = itemCardapioRepository.findAll();
        assertThat(itemCardapioList).hasSize(databaseSizeBeforeCreate + 1);
        ItemCardapio testItemCardapio = itemCardapioList.get(itemCardapioList.size() - 1);
    }

    @Test
    @Transactional
    void createItemCardapioWithExistingId() throws Exception {
        // Create the ItemCardapio with an existing ID
        itemCardapio.setId(1L);

        int databaseSizeBeforeCreate = itemCardapioRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItemCardapioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemCardapio)))
            .andExpect(status().isBadRequest());

        // Validate the ItemCardapio in the database
        List<ItemCardapio> itemCardapioList = itemCardapioRepository.findAll();
        assertThat(itemCardapioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItemCardapios() throws Exception {
        // Initialize the database
        itemCardapioRepository.saveAndFlush(itemCardapio);

        // Get all the itemCardapioList
        restItemCardapioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itemCardapio.getId().intValue())));
    }

    @Test
    @Transactional
    void getItemCardapio() throws Exception {
        // Initialize the database
        itemCardapioRepository.saveAndFlush(itemCardapio);

        // Get the itemCardapio
        restItemCardapioMockMvc
            .perform(get(ENTITY_API_URL_ID, itemCardapio.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itemCardapio.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingItemCardapio() throws Exception {
        // Get the itemCardapio
        restItemCardapioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItemCardapio() throws Exception {
        // Initialize the database
        itemCardapioRepository.saveAndFlush(itemCardapio);

        int databaseSizeBeforeUpdate = itemCardapioRepository.findAll().size();

        // Update the itemCardapio
        ItemCardapio updatedItemCardapio = itemCardapioRepository.findById(itemCardapio.getId()).get();
        // Disconnect from session so that the updates on updatedItemCardapio are not directly saved in db
        em.detach(updatedItemCardapio);

        restItemCardapioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItemCardapio.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItemCardapio))
            )
            .andExpect(status().isOk());

        // Validate the ItemCardapio in the database
        List<ItemCardapio> itemCardapioList = itemCardapioRepository.findAll();
        assertThat(itemCardapioList).hasSize(databaseSizeBeforeUpdate);
        ItemCardapio testItemCardapio = itemCardapioList.get(itemCardapioList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingItemCardapio() throws Exception {
        int databaseSizeBeforeUpdate = itemCardapioRepository.findAll().size();
        itemCardapio.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemCardapioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itemCardapio.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemCardapio))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemCardapio in the database
        List<ItemCardapio> itemCardapioList = itemCardapioRepository.findAll();
        assertThat(itemCardapioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItemCardapio() throws Exception {
        int databaseSizeBeforeUpdate = itemCardapioRepository.findAll().size();
        itemCardapio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemCardapioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemCardapio))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemCardapio in the database
        List<ItemCardapio> itemCardapioList = itemCardapioRepository.findAll();
        assertThat(itemCardapioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItemCardapio() throws Exception {
        int databaseSizeBeforeUpdate = itemCardapioRepository.findAll().size();
        itemCardapio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemCardapioMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemCardapio)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemCardapio in the database
        List<ItemCardapio> itemCardapioList = itemCardapioRepository.findAll();
        assertThat(itemCardapioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItemCardapioWithPatch() throws Exception {
        // Initialize the database
        itemCardapioRepository.saveAndFlush(itemCardapio);

        int databaseSizeBeforeUpdate = itemCardapioRepository.findAll().size();

        // Update the itemCardapio using partial update
        ItemCardapio partialUpdatedItemCardapio = new ItemCardapio();
        partialUpdatedItemCardapio.setId(itemCardapio.getId());

        restItemCardapioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemCardapio.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemCardapio))
            )
            .andExpect(status().isOk());

        // Validate the ItemCardapio in the database
        List<ItemCardapio> itemCardapioList = itemCardapioRepository.findAll();
        assertThat(itemCardapioList).hasSize(databaseSizeBeforeUpdate);
        ItemCardapio testItemCardapio = itemCardapioList.get(itemCardapioList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateItemCardapioWithPatch() throws Exception {
        // Initialize the database
        itemCardapioRepository.saveAndFlush(itemCardapio);

        int databaseSizeBeforeUpdate = itemCardapioRepository.findAll().size();

        // Update the itemCardapio using partial update
        ItemCardapio partialUpdatedItemCardapio = new ItemCardapio();
        partialUpdatedItemCardapio.setId(itemCardapio.getId());

        restItemCardapioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemCardapio.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemCardapio))
            )
            .andExpect(status().isOk());

        // Validate the ItemCardapio in the database
        List<ItemCardapio> itemCardapioList = itemCardapioRepository.findAll();
        assertThat(itemCardapioList).hasSize(databaseSizeBeforeUpdate);
        ItemCardapio testItemCardapio = itemCardapioList.get(itemCardapioList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingItemCardapio() throws Exception {
        int databaseSizeBeforeUpdate = itemCardapioRepository.findAll().size();
        itemCardapio.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemCardapioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itemCardapio.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemCardapio))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemCardapio in the database
        List<ItemCardapio> itemCardapioList = itemCardapioRepository.findAll();
        assertThat(itemCardapioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItemCardapio() throws Exception {
        int databaseSizeBeforeUpdate = itemCardapioRepository.findAll().size();
        itemCardapio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemCardapioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemCardapio))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemCardapio in the database
        List<ItemCardapio> itemCardapioList = itemCardapioRepository.findAll();
        assertThat(itemCardapioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItemCardapio() throws Exception {
        int databaseSizeBeforeUpdate = itemCardapioRepository.findAll().size();
        itemCardapio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemCardapioMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(itemCardapio))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemCardapio in the database
        List<ItemCardapio> itemCardapioList = itemCardapioRepository.findAll();
        assertThat(itemCardapioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItemCardapio() throws Exception {
        // Initialize the database
        itemCardapioRepository.saveAndFlush(itemCardapio);

        int databaseSizeBeforeDelete = itemCardapioRepository.findAll().size();

        // Delete the itemCardapio
        restItemCardapioMockMvc
            .perform(delete(ENTITY_API_URL_ID, itemCardapio.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItemCardapio> itemCardapioList = itemCardapioRepository.findAll();
        assertThat(itemCardapioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
