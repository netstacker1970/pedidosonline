package br.pedidosonline.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.pedidosonline.IntegrationTest;
import br.pedidosonline.domain.Conta;
import br.pedidosonline.repository.ContaRepository;
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
 * Integration tests for the {@link ContaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ContaResourceIT {

    private static final LocalDate DEFAULT_DT_CONTA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DT_CONTA = LocalDate.now(ZoneId.systemDefault());

    private static final Float DEFAULT_VALOR_CONTA = 1F;
    private static final Float UPDATED_VALOR_CONTA = 2F;

    private static final String ENTITY_API_URL = "/api/contas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ContaRepository contaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restContaMockMvc;

    private Conta conta;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Conta createEntity(EntityManager em) {
        Conta conta = new Conta().dtConta(DEFAULT_DT_CONTA).valorConta(DEFAULT_VALOR_CONTA);
        return conta;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Conta createUpdatedEntity(EntityManager em) {
        Conta conta = new Conta().dtConta(UPDATED_DT_CONTA).valorConta(UPDATED_VALOR_CONTA);
        return conta;
    }

    @BeforeEach
    public void initTest() {
        conta = createEntity(em);
    }

    @Test
    @Transactional
    void createConta() throws Exception {
        int databaseSizeBeforeCreate = contaRepository.findAll().size();
        // Create the Conta
        restContaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(conta)))
            .andExpect(status().isCreated());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeCreate + 1);
        Conta testConta = contaList.get(contaList.size() - 1);
        assertThat(testConta.getDtConta()).isEqualTo(DEFAULT_DT_CONTA);
        assertThat(testConta.getValorConta()).isEqualTo(DEFAULT_VALOR_CONTA);
    }

    @Test
    @Transactional
    void createContaWithExistingId() throws Exception {
        // Create the Conta with an existing ID
        conta.setId(1L);

        int databaseSizeBeforeCreate = contaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restContaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(conta)))
            .andExpect(status().isBadRequest());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllContas() throws Exception {
        // Initialize the database
        contaRepository.saveAndFlush(conta);

        // Get all the contaList
        restContaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(conta.getId().intValue())))
            .andExpect(jsonPath("$.[*].dtConta").value(hasItem(DEFAULT_DT_CONTA.toString())))
            .andExpect(jsonPath("$.[*].valorConta").value(hasItem(DEFAULT_VALOR_CONTA.doubleValue())));
    }

    @Test
    @Transactional
    void getConta() throws Exception {
        // Initialize the database
        contaRepository.saveAndFlush(conta);

        // Get the conta
        restContaMockMvc
            .perform(get(ENTITY_API_URL_ID, conta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(conta.getId().intValue()))
            .andExpect(jsonPath("$.dtConta").value(DEFAULT_DT_CONTA.toString()))
            .andExpect(jsonPath("$.valorConta").value(DEFAULT_VALOR_CONTA.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingConta() throws Exception {
        // Get the conta
        restContaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingConta() throws Exception {
        // Initialize the database
        contaRepository.saveAndFlush(conta);

        int databaseSizeBeforeUpdate = contaRepository.findAll().size();

        // Update the conta
        Conta updatedConta = contaRepository.findById(conta.getId()).get();
        // Disconnect from session so that the updates on updatedConta are not directly saved in db
        em.detach(updatedConta);
        updatedConta.dtConta(UPDATED_DT_CONTA).valorConta(UPDATED_VALOR_CONTA);

        restContaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConta))
            )
            .andExpect(status().isOk());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeUpdate);
        Conta testConta = contaList.get(contaList.size() - 1);
        assertThat(testConta.getDtConta()).isEqualTo(UPDATED_DT_CONTA);
        assertThat(testConta.getValorConta()).isEqualTo(UPDATED_VALOR_CONTA);
    }

    @Test
    @Transactional
    void putNonExistingConta() throws Exception {
        int databaseSizeBeforeUpdate = contaRepository.findAll().size();
        conta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, conta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(conta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConta() throws Exception {
        int databaseSizeBeforeUpdate = contaRepository.findAll().size();
        conta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(conta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConta() throws Exception {
        int databaseSizeBeforeUpdate = contaRepository.findAll().size();
        conta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(conta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateContaWithPatch() throws Exception {
        // Initialize the database
        contaRepository.saveAndFlush(conta);

        int databaseSizeBeforeUpdate = contaRepository.findAll().size();

        // Update the conta using partial update
        Conta partialUpdatedConta = new Conta();
        partialUpdatedConta.setId(conta.getId());

        restContaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConta))
            )
            .andExpect(status().isOk());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeUpdate);
        Conta testConta = contaList.get(contaList.size() - 1);
        assertThat(testConta.getDtConta()).isEqualTo(DEFAULT_DT_CONTA);
        assertThat(testConta.getValorConta()).isEqualTo(DEFAULT_VALOR_CONTA);
    }

    @Test
    @Transactional
    void fullUpdateContaWithPatch() throws Exception {
        // Initialize the database
        contaRepository.saveAndFlush(conta);

        int databaseSizeBeforeUpdate = contaRepository.findAll().size();

        // Update the conta using partial update
        Conta partialUpdatedConta = new Conta();
        partialUpdatedConta.setId(conta.getId());

        partialUpdatedConta.dtConta(UPDATED_DT_CONTA).valorConta(UPDATED_VALOR_CONTA);

        restContaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConta))
            )
            .andExpect(status().isOk());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeUpdate);
        Conta testConta = contaList.get(contaList.size() - 1);
        assertThat(testConta.getDtConta()).isEqualTo(UPDATED_DT_CONTA);
        assertThat(testConta.getValorConta()).isEqualTo(UPDATED_VALOR_CONTA);
    }

    @Test
    @Transactional
    void patchNonExistingConta() throws Exception {
        int databaseSizeBeforeUpdate = contaRepository.findAll().size();
        conta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, conta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(conta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConta() throws Exception {
        int databaseSizeBeforeUpdate = contaRepository.findAll().size();
        conta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(conta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConta() throws Exception {
        int databaseSizeBeforeUpdate = contaRepository.findAll().size();
        conta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(conta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConta() throws Exception {
        // Initialize the database
        contaRepository.saveAndFlush(conta);

        int databaseSizeBeforeDelete = contaRepository.findAll().size();

        // Delete the conta
        restContaMockMvc
            .perform(delete(ENTITY_API_URL_ID, conta.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
