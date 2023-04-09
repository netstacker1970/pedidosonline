package br.pedidosonline.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pagamento.
 */
@Entity
@Table(name = "pagamento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Pagamento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "valor")
    private Float valor;

    @Column(name = "dt_pagamento")
    private LocalDate dtPagamento;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cliente", "caixa" }, allowSetters = true)
    private Conta conta;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cliente", "caixa" }, allowSetters = true)
    private Conta cliente;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pagamento id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getValor() {
        return this.valor;
    }

    public Pagamento valor(Float valor) {
        this.setValor(valor);
        return this;
    }

    public void setValor(Float valor) {
        this.valor = valor;
    }

    public LocalDate getDtPagamento() {
        return this.dtPagamento;
    }

    public Pagamento dtPagamento(LocalDate dtPagamento) {
        this.setDtPagamento(dtPagamento);
        return this;
    }

    public void setDtPagamento(LocalDate dtPagamento) {
        this.dtPagamento = dtPagamento;
    }

    public Conta getConta() {
        return this.conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    public Pagamento conta(Conta conta) {
        this.setConta(conta);
        return this;
    }

    public Conta getCliente() {
        return this.cliente;
    }

    public void setCliente(Conta conta) {
        this.cliente = conta;
    }

    public Pagamento cliente(Conta conta) {
        this.setCliente(conta);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pagamento)) {
            return false;
        }
        return id != null && id.equals(((Pagamento) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pagamento{" +
            "id=" + getId() +
            ", valor=" + getValor() +
            ", dtPagamento='" + getDtPagamento() + "'" +
            "}";
    }
}
