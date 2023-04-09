package br.pedidosonline.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Caixa.
 */
@Entity
@Table(name = "caixa")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Caixa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "saldoinicio")
    private Float saldoinicio;

    @Column(name = "saldo_fim")
    private Float saldoFim;

    @Column(name = "dt_abertura")
    private LocalDate dtAbertura;

    @Column(name = "dt_fechamento")
    private LocalDate dtFechamento;

    @Column(name = "valor")
    private Float valor;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Caixa id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getSaldoinicio() {
        return this.saldoinicio;
    }

    public Caixa saldoinicio(Float saldoinicio) {
        this.setSaldoinicio(saldoinicio);
        return this;
    }

    public void setSaldoinicio(Float saldoinicio) {
        this.saldoinicio = saldoinicio;
    }

    public Float getSaldoFim() {
        return this.saldoFim;
    }

    public Caixa saldoFim(Float saldoFim) {
        this.setSaldoFim(saldoFim);
        return this;
    }

    public void setSaldoFim(Float saldoFim) {
        this.saldoFim = saldoFim;
    }

    public LocalDate getDtAbertura() {
        return this.dtAbertura;
    }

    public Caixa dtAbertura(LocalDate dtAbertura) {
        this.setDtAbertura(dtAbertura);
        return this;
    }

    public void setDtAbertura(LocalDate dtAbertura) {
        this.dtAbertura = dtAbertura;
    }

    public LocalDate getDtFechamento() {
        return this.dtFechamento;
    }

    public Caixa dtFechamento(LocalDate dtFechamento) {
        this.setDtFechamento(dtFechamento);
        return this;
    }

    public void setDtFechamento(LocalDate dtFechamento) {
        this.dtFechamento = dtFechamento;
    }

    public Float getValor() {
        return this.valor;
    }

    public Caixa valor(Float valor) {
        this.setValor(valor);
        return this;
    }

    public void setValor(Float valor) {
        this.valor = valor;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Caixa)) {
            return false;
        }
        return id != null && id.equals(((Caixa) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Caixa{" +
            "id=" + getId() +
            ", saldoinicio=" + getSaldoinicio() +
            ", saldoFim=" + getSaldoFim() +
            ", dtAbertura='" + getDtAbertura() + "'" +
            ", dtFechamento='" + getDtFechamento() + "'" +
            ", valor=" + getValor() +
            "}";
    }
}
