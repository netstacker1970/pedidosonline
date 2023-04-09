package br.pedidosonline.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.pedidosonline.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ItemContaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItemConta.class);
        ItemConta itemConta1 = new ItemConta();
        itemConta1.setId(1L);
        ItemConta itemConta2 = new ItemConta();
        itemConta2.setId(itemConta1.getId());
        assertThat(itemConta1).isEqualTo(itemConta2);
        itemConta2.setId(2L);
        assertThat(itemConta1).isNotEqualTo(itemConta2);
        itemConta1.setId(null);
        assertThat(itemConta1).isNotEqualTo(itemConta2);
    }
}
