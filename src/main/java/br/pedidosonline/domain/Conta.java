package br.pedidosonline.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Conta.
 */
@Entity
@Table(name = "conta")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Conta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "dt_conta")
    private LocalDate dtConta;

    @Column(name = "valor_conta")
    private Float valorConta;

    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    private Caixa caixa;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Conta id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDtConta() {
        return this.dtConta;
    }

    public Conta dtConta(LocalDate dtConta) {
        this.setDtConta(dtConta);
        return this;
    }

    public void setDtConta(LocalDate dtConta) {
        this.dtConta = dtConta;
    }

    public Float getValorConta() {
        return this.valorConta;
    }

    public Conta valorConta(Float valorConta) {
        this.setValorConta(valorConta);
        return this;
    }

    public void setValorConta(Float valorConta) {
        this.valorConta = valorConta;
    }

    public Cliente getCliente() {
        return this.cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Conta cliente(Cliente cliente) {
        this.setCliente(cliente);
        return this;
    }

    public Caixa getCaixa() {
        return this.caixa;
    }

    public void setCaixa(Caixa caixa) {
        this.caixa = caixa;
    }

    public Conta caixa(Caixa caixa) {
        this.setCaixa(caixa);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Conta)) {
            return false;
        }
        return id != null && id.equals(((Conta) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Conta{" +
            "id=" + getId() +
            ", dtConta='" + getDtConta() + "'" +
            ", valorConta=" + getValorConta() +
            "}";
    }
}
