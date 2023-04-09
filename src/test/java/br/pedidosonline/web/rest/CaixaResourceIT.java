package br.pedidosonline.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.pedidosonline.IntegrationTest;
import br.pedidosonline.domain.Caixa;
import br.pedidosonline.repository.CaixaRepository;
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
 * Integration tests for the {@link CaixaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CaixaResourceIT {

    private static final Float DEFAULT_SALDOINICIO = 1F;
    private static final Float UPDATED_SALDOINICIO = 2F;

    private static final Float DEFAULT_SALDO_FIM = 1F;
    private static final Float UPDATED_SALDO_FIM = 2F;

    private static final LocalDate DEFAULT_DT_ABERTURA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DT_ABERTURA = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DT_FECHAMENTO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DT_FECHAMENTO = LocalDate.now(ZoneId.systemDefault());

    private static final Float DEFAULT_VALOR = 1F;
    private static final Float UPDATED_VALOR = 2F;

    private static final String ENTITY_API_URL = "/api/caixas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CaixaRepository caixaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCaixaMockMvc;

    private Caixa caixa;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Caixa createEntity(EntityManager em) {
        Caixa caixa = new Caixa()
            .saldoinicio(DEFAULT_SALDOINICIO)
            .saldoFim(DEFAULT_SALDO_FIM)
            .dtAbertura(DEFAULT_DT_ABERTURA)
            .dtFechamento(DEFAULT_DT_FECHAMENTO)
            .valor(DEFAULT_VALOR);
        return caixa;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Caixa createUpdatedEntity(EntityManager em) {
        Caixa caixa = new Caixa()
            .saldoinicio(UPDATED_SALDOINICIO)
            .saldoFim(UPDATED_SALDO_FIM)
            .dtAbertura(UPDATED_DT_ABERTURA)
            .dtFechamento(UPDATED_DT_FECHAMENTO)
            .valor(UPDATED_VALOR);
        return caixa;
    }

    @BeforeEach
    public void initTest() {
        caixa = createEntity(em);
    }

    @Test
    @Transactional
    void createCaixa() throws Exception {
        int databaseSizeBeforeCreate = caixaRepository.findAll().size();
        // Create the Caixa
        restCaixaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caixa)))
            .andExpect(status().isCreated());

        // Validate the Caixa in the database
        List<Caixa> caixaList = caixaRepository.findAll();
        assertThat(caixaList).hasSize(databaseSizeBeforeCreate + 1);
        Caixa testCaixa = caixaList.get(caixaList.size() - 1);
        assertThat(testCaixa.getSaldoinicio()).isEqualTo(DEFAULT_SALDOINICIO);
        assertThat(testCaixa.getSaldoFim()).isEqualTo(DEFAULT_SALDO_FIM);
        assertThat(testCaixa.getDtAbertura()).isEqualTo(DEFAULT_DT_ABERTURA);
        assertThat(testCaixa.getDtFechamento()).isEqualTo(DEFAULT_DT_FECHAMENTO);
        assertThat(testCaixa.getValor()).isEqualTo(DEFAULT_VALOR);
    }

    @Test
    @Transactional
    void createCaixaWithExistingId() throws Exception {
        // Create the Caixa with an existing ID
        caixa.setId(1L);

        int databaseSizeBeforeCreate = caixaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCaixaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caixa)))
            .andExpect(status().isBadRequest());

        // Validate the Caixa in the database
        List<Caixa> caixaList = caixaRepository.findAll();
        assertThat(caixaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCaixas() throws Exception {
        // Initialize the database
        caixaRepository.saveAndFlush(caixa);

        // Get all the caixaList
        restCaixaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(caixa.getId().intValue())))
            .andExpect(jsonPath("$.[*].saldoinicio").value(hasItem(DEFAULT_SALDOINICIO.doubleValue())))
            .andExpect(jsonPath("$.[*].saldoFim").value(hasItem(DEFAULT_SALDO_FIM.doubleValue())))
            .andExpect(jsonPath("$.[*].dtAbertura").value(hasItem(DEFAULT_DT_ABERTURA.toString())))
            .andExpect(jsonPath("$.[*].dtFechamento").value(hasItem(DEFAULT_DT_FECHAMENTO.toString())))
            .andExpect(jsonPath("$.[*].valor").value(hasItem(DEFAULT_VALOR.doubleValue())));
    }

    @Test
    @Transactional
    void getCaixa() throws Exception {
        // Initialize the database
        caixaRepository.saveAndFlush(caixa);

        // Get the caixa
        restCaixaMockMvc
            .perform(get(ENTITY_API_URL_ID, caixa.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(caixa.getId().intValue()))
            .andExpect(jsonPath("$.saldoinicio").value(DEFAULT_SALDOINICIO.doubleValue()))
            .andExpect(jsonPath("$.saldoFim").value(DEFAULT_SALDO_FIM.doubleValue()))
            .andExpect(jsonPath("$.dtAbertura").value(DEFAULT_DT_ABERTURA.toString()))
            .andExpect(jsonPath("$.dtFechamento").value(DEFAULT_DT_FECHAMENTO.toString()))
            .andExpect(jsonPath("$.valor").value(DEFAULT_VALOR.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingCaixa() throws Exception {
        // Get the caixa
        restCaixaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCaixa() throws Exception {
        // Initialize the database
        caixaRepository.saveAndFlush(caixa);

        int databaseSizeBeforeUpdate = caixaRepository.findAll().size();

        // Update the caixa
        Caixa updatedCaixa = caixaRepository.findById(caixa.getId()).get();
        // Disconnect from session so that the updates on updatedCaixa are not directly saved in db
        em.detach(updatedCaixa);
        updatedCaixa
            .saldoinicio(UPDATED_SALDOINICIO)
            .saldoFim(UPDATED_SALDO_FIM)
            .dtAbertura(UPDATED_DT_ABERTURA)
            .dtFechamento(UPDATED_DT_FECHAMENTO)
            .valor(UPDATED_VALOR);

        restCaixaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCaixa.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCaixa))
            )
            .andExpect(status().isOk());

        // Validate the Caixa in the database
        List<Caixa> caixaList = caixaRepository.findAll();
        assertThat(caixaList).hasSize(databaseSizeBeforeUpdate);
        Caixa testCaixa = caixaList.get(caixaList.size() - 1);
        assertThat(testCaixa.getSaldoinicio()).isEqualTo(UPDATED_SALDOINICIO);
        assertThat(testCaixa.getSaldoFim()).isEqualTo(UPDATED_SALDO_FIM);
        assertThat(testCaixa.getDtAbertura()).isEqualTo(UPDATED_DT_ABERTURA);
        assertThat(testCaixa.getDtFechamento()).isEqualTo(UPDATED_DT_FECHAMENTO);
        assertThat(testCaixa.getValor()).isEqualTo(UPDATED_VALOR);
    }

    @Test
    @Transactional
    void putNonExistingCaixa() throws Exception {
        int databaseSizeBeforeUpdate = caixaRepository.findAll().size();
        caixa.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCaixaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, caixa.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caixa))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caixa in the database
        List<Caixa> caixaList = caixaRepository.findAll();
        assertThat(caixaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCaixa() throws Exception {
        int databaseSizeBeforeUpdate = caixaRepository.findAll().size();
        caixa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaixaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caixa))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caixa in the database
        List<Caixa> caixaList = caixaRepository.findAll();
        assertThat(caixaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCaixa() throws Exception {
        int databaseSizeBeforeUpdate = caixaRepository.findAll().size();
        caixa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaixaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caixa)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Caixa in the database
        List<Caixa> caixaList = caixaRepository.findAll();
        assertThat(caixaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCaixaWithPatch() throws Exception {
        // Initialize the database
        caixaRepository.saveAndFlush(caixa);

        int databaseSizeBeforeUpdate = caixaRepository.findAll().size();

        // Update the caixa using partial update
        Caixa partialUpdatedCaixa = new Caixa();
        partialUpdatedCaixa.setId(caixa.getId());

        partialUpdatedCaixa.saldoFim(UPDATED_SALDO_FIM);

        restCaixaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCaixa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCaixa))
            )
            .andExpect(status().isOk());

        // Validate the Caixa in the database
        List<Caixa> caixaList = caixaRepository.findAll();
        assertThat(caixaList).hasSize(databaseSizeBeforeUpdate);
        Caixa testCaixa = caixaList.get(caixaList.size() - 1);
        assertThat(testCaixa.getSaldoinicio()).isEqualTo(DEFAULT_SALDOINICIO);
        assertThat(testCaixa.getSaldoFim()).isEqualTo(UPDATED_SALDO_FIM);
        assertThat(testCaixa.getDtAbertura()).isEqualTo(DEFAULT_DT_ABERTURA);
        assertThat(testCaixa.getDtFechamento()).isEqualTo(DEFAULT_DT_FECHAMENTO);
        assertThat(testCaixa.getValor()).isEqualTo(DEFAULT_VALOR);
    }

    @Test
    @Transactional
    void fullUpdateCaixaWithPatch() throws Exception {
        // Initialize the database
        caixaRepository.saveAndFlush(caixa);

        int databaseSizeBeforeUpdate = caixaRepository.findAll().size();

        // Update the caixa using partial update
        Caixa partialUpdatedCaixa = new Caixa();
        partialUpdatedCaixa.setId(caixa.getId());

        partialUpdatedCaixa
            .saldoinicio(UPDATED_SALDOINICIO)
            .saldoFim(UPDATED_SALDO_FIM)
            .dtAbertura(UPDATED_DT_ABERTURA)
            .dtFechamento(UPDATED_DT_FECHAMENTO)
            .valor(UPDATED_VALOR);

        restCaixaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCaixa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCaixa))
            )
            .andExpect(status().isOk());

        // Validate the Caixa in the database
        List<Caixa> caixaList = caixaRepository.findAll();
        assertThat(caixaList).hasSize(databaseSizeBeforeUpdate);
        Caixa testCaixa = caixaList.get(caixaList.size() - 1);
        assertThat(testCaixa.getSaldoinicio()).isEqualTo(UPDATED_SALDOINICIO);
        assertThat(testCaixa.getSaldoFim()).isEqualTo(UPDATED_SALDO_FIM);
        assertThat(testCaixa.getDtAbertura()).isEqualTo(UPDATED_DT_ABERTURA);
        assertThat(testCaixa.getDtFechamento()).isEqualTo(UPDATED_DT_FECHAMENTO);
        assertThat(testCaixa.getValor()).isEqualTo(UPDATED_VALOR);
    }

    @Test
    @Transactional
    void patchNonExistingCaixa() throws Exception {
        int databaseSizeBeforeUpdate = caixaRepository.findAll().size();
        caixa.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCaixaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, caixa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caixa))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caixa in the database
        List<Caixa> caixaList = caixaRepository.findAll();
        assertThat(caixaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCaixa() throws Exception {
        int databaseSizeBeforeUpdate = caixaRepository.findAll().size();
        caixa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaixaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caixa))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caixa in the database
        List<Caixa> caixaList = caixaRepository.findAll();
        assertThat(caixaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCaixa() throws Exception {
        int databaseSizeBeforeUpdate = caixaRepository.findAll().size();
        caixa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaixaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(caixa)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Caixa in the database
        List<Caixa> caixaList = caixaRepository.findAll();
        assertThat(caixaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCaixa() throws Exception {
        // Initialize the database
        caixaRepository.saveAndFlush(caixa);

        int databaseSizeBeforeDelete = caixaRepository.findAll().size();

        // Delete the caixa
        restCaixaMockMvc
            .perform(delete(ENTITY_API_URL_ID, caixa.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Caixa> caixaList = caixaRepository.findAll();
        assertThat(caixaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
