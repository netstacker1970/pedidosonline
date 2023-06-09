package br.pedidosonline.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.pedidosonline.IntegrationTest;
import br.pedidosonline.domain.Cardapio;
import br.pedidosonline.repository.CardapioRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link CardapioResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CardapioResourceIT {

    private static final LocalDate DEFAULT_DT_CARDAPIO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DT_CARDAPIO = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/cardapios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CardapioRepository cardapioRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCardapioMockMvc;

    private Cardapio cardapio;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cardapio createEntity(EntityManager em) {
        Cardapio cardapio = new Cardapio().dtCardapio(DEFAULT_DT_CARDAPIO);
        return cardapio;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cardapio createUpdatedEntity(EntityManager em) {
        Cardapio cardapio = new Cardapio().dtCardapio(UPDATED_DT_CARDAPIO);
        return cardapio;
    }

    @BeforeEach
    public void initTest() {
        cardapio = createEntity(em);
    }

    @Test
    @Transactional
    void createCardapio() throws Exception {
        int databaseSizeBeforeCreate = cardapioRepository.findAll().size();
        // Create the Cardapio
        restCardapioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cardapio)))
            .andExpect(status().isCreated());

        // Validate the Cardapio in the database
        List<Cardapio> cardapioList = cardapioRepository.findAll();
        assertThat(cardapioList).hasSize(databaseSizeBeforeCreate + 1);
        Cardapio testCardapio = cardapioList.get(cardapioList.size() - 1);
        assertThat(testCardapio.getDtCardapio()).isEqualTo(DEFAULT_DT_CARDAPIO);
    }

    @Test
    @Transactional
    void createCardapioWithExistingId() throws Exception {
        // Create the Cardapio with an existing ID
        cardapio.setId(1L);

        int databaseSizeBeforeCreate = cardapioRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCardapioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cardapio)))
            .andExpect(status().isBadRequest());

        // Validate the Cardapio in the database
        List<Cardapio> cardapioList = cardapioRepository.findAll();
        assertThat(cardapioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCardapios() throws Exception {
        // Initialize the database
        cardapioRepository.saveAndFlush(cardapio);

        // Get all the cardapioList
        restCardapioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cardapio.getId().intValue())))
            .andExpect(jsonPath("$.[*].dtCardapio").value(hasItem(DEFAULT_DT_CARDAPIO.toString())));
    }

    @Test
    @Transactional
    void getCardapio() throws Exception {
        // Initialize the database
        cardapioRepository.saveAndFlush(cardapio);

        // Get the cardapio
        restCardapioMockMvc
            .perform(get(ENTITY_API_URL_ID, cardapio.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cardapio.getId().intValue()))
            .andExpect(jsonPath("$.dtCardapio").value(DEFAULT_DT_CARDAPIO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCardapio() throws Exception {
        // Get the cardapio
        restCardapioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCardapio() throws Exception {
        // Initialize the database
        cardapioRepository.saveAndFlush(cardapio);

        int databaseSizeBeforeUpdate = cardapioRepository.findAll().size();

        // Update the cardapio
        Cardapio updatedCardapio = cardapioRepository.findById(cardapio.getId()).get();
        // Disconnect from session so that the updates on updatedCardapio are not directly saved in db
        em.detach(updatedCardapio);
        updatedCardapio.dtCardapio(UPDATED_DT_CARDAPIO);

        restCardapioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCardapio.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCardapio))
            )
            .andExpect(status().isOk());

        // Validate the Cardapio in the database
        List<Cardapio> cardapioList = cardapioRepository.findAll();
        assertThat(cardapioList).hasSize(databaseSizeBeforeUpdate);
        Cardapio testCardapio = cardapioList.get(cardapioList.size() - 1);
        assertThat(testCardapio.getDtCardapio()).isEqualTo(UPDATED_DT_CARDAPIO);
    }

    @Test
    @Transactional
    void putNonExistingCardapio() throws Exception {
        int databaseSizeBeforeUpdate = cardapioRepository.findAll().size();
        cardapio.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCardapioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, cardapio.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cardapio))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cardapio in the database
        List<Cardapio> cardapioList = cardapioRepository.findAll();
        assertThat(cardapioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCardapio() throws Exception {
        int databaseSizeBeforeUpdate = cardapioRepository.findAll().size();
        cardapio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCardapioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cardapio))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cardapio in the database
        List<Cardapio> cardapioList = cardapioRepository.findAll();
        assertThat(cardapioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCardapio() throws Exception {
        int databaseSizeBeforeUpdate = cardapioRepository.findAll().size();
        cardapio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCardapioMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cardapio)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cardapio in the database
        List<Cardapio> cardapioList = cardapioRepository.findAll();
        assertThat(cardapioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCardapioWithPatch() throws Exception {
        // Initialize the database
        cardapioRepository.saveAndFlush(cardapio);

        int databaseSizeBeforeUpdate = cardapioRepository.findAll().size();

        // Update the cardapio using partial update
        Cardapio partialUpdatedCardapio = new Cardapio();
        partialUpdatedCardapio.setId(cardapio.getId());

        restCardapioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCardapio.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCardapio))
            )
            .andExpect(status().isOk());

        // Validate the Cardapio in the database
        List<Cardapio> cardapioList = cardapioRepository.findAll();
        assertThat(cardapioList).hasSize(databaseSizeBeforeUpdate);
        Cardapio testCardapio = cardapioList.get(cardapioList.size() - 1);
        assertThat(testCardapio.getDtCardapio()).isEqualTo(DEFAULT_DT_CARDAPIO);
    }

    @Test
    @Transactional
    void fullUpdateCardapioWithPatch() throws Exception {
        // Initialize the database
        cardapioRepository.saveAndFlush(cardapio);

        int databaseSizeBeforeUpdate = cardapioRepository.findAll().size();

        // Update the cardapio using partial update
        Cardapio partialUpdatedCardapio = new Cardapio();
        partialUpdatedCardapio.setId(cardapio.getId());

        partialUpdatedCardapio.dtCardapio(UPDATED_DT_CARDAPIO);

        restCardapioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCardapio.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCardapio))
            )
            .andExpect(status().isOk());

        // Validate the Cardapio in the database
        List<Cardapio> cardapioList = cardapioRepository.findAll();
        assertThat(cardapioList).hasSize(databaseSizeBeforeUpdate);
        Cardapio testCardapio = cardapioList.get(cardapioList.size() - 1);
        assertThat(testCardapio.getDtCardapio()).isEqualTo(UPDATED_DT_CARDAPIO);
    }

    @Test
    @Transactional
    void patchNonExistingCardapio() throws Exception {
        int databaseSizeBeforeUpdate = cardapioRepository.findAll().size();
        cardapio.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCardapioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cardapio.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cardapio))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cardapio in the database
        List<Cardapio> cardapioList = cardapioRepository.findAll();
        assertThat(cardapioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCardapio() throws Exception {
        int databaseSizeBeforeUpdate = cardapioRepository.findAll().size();
        cardapio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCardapioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cardapio))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cardapio in the database
        List<Cardapio> cardapioList = cardapioRepository.findAll();
        assertThat(cardapioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCardapio() throws Exception {
        int databaseSizeBeforeUpdate = cardapioRepository.findAll().size();
        cardapio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCardapioMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(cardapio)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cardapio in the database
        List<Cardapio> cardapioList = cardapioRepository.findAll();
        assertThat(cardapioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCardapio() throws Exception {
        // Initialize the database
        cardapioRepository.saveAndFlush(cardapio);

        int databaseSizeBeforeDelete = cardapioRepository.findAll().size();

        // Delete the cardapio
        restCardapioMockMvc
            .perform(delete(ENTITY_API_URL_ID, cardapio.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Cardapio> cardapioList = cardapioRepository.findAll();
        assertThat(cardapioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
