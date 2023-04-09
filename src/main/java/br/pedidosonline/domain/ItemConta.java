package br.pedidosonline.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ItemConta.
 */
@Entity
@Table(name = "item_conta")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ItemConta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "valor_conta")
    private Float valorConta;

    @ManyToOne
    @JsonIgnoreProperties(value = { "categoria" }, allowSetters = true)
    private Produto produto;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cardapio", "produto" }, allowSetters = true)
    private ItemCardapio itemCardapio;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cliente", "caixa" }, allowSetters = true)
    private Conta conta;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ItemConta id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getValorConta() {
        return this.valorConta;
    }

    public ItemConta valorConta(Float valorConta) {
        this.setValorConta(valorConta);
        return this;
    }

    public void setValorConta(Float valorConta) {
        this.valorConta = valorConta;
    }

    public Produto getProduto() {
        return this.produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public ItemConta produto(Produto produto) {
        this.setProduto(produto);
        return this;
    }

    public ItemCardapio getItemCardapio() {
        return this.itemCardapio;
    }

    public void setItemCardapio(ItemCardapio itemCardapio) {
        this.itemCardapio = itemCardapio;
    }

    public ItemConta itemCardapio(ItemCardapio itemCardapio) {
        this.setItemCardapio(itemCardapio);
        return this;
    }

    public Conta getConta() {
        return this.conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    public ItemConta conta(Conta conta) {
        this.setConta(conta);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ItemConta)) {
            return false;
        }
        return id != null && id.equals(((ItemConta) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ItemConta{" +
            "id=" + getId() +
            ", valorConta=" + getValorConta() +
            "}";
    }
}
