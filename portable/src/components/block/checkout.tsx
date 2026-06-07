import { CheckoutItem } from "@components/block/checkout-item";
import { Section } from "@components/kit/section";
import { Button } from "@components/ui/interactive/button";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { useCart } from "@contexts/cart";
import { useClasses } from "@styles";

export function Checkout() {
  const { entries } = useCart();

  const price = Object.values(entries).reduce((sum, entry) => sum + (
    entry.count * entry.details.price.final
  ), 0);

  return (
    <Section className={useClasses("checkout")}>
      <Heading size="large">
        Checkout
      </Heading>

      <Container className={useClasses("checkout-details")}>
        <Container className={useClasses("checkout-items")}>
          {Object.values(entries).map(entry => (
            <CheckoutItem
              key={entry.details.id}
              count={entry.count}
              details={entry.details}
            />
          ))}
        </Container>

        <Container className={useClasses("checkout-summary")}>
          <Container className={useClasses("checkout-billing")}>
            <Heading size="medium">
              Summary
            </Heading>

            <Container className={useClasses("checkout-summary-details")}>
              <Container className={useClasses("checkout-summary-row")}>
                <Text>
                  Total Items
                </Text>

                <Text>
                  {Object.values(entries).reduce((sum, entry) => sum + entry.count, 0)}
                </Text>
              </Container>

              <Container className={useClasses("checkout-summary-row")}>
                <Text>
                  Total Price
                </Text>

                <Text>
                  {price}
                </Text>
              </Container>
            </Container>
          </Container>

          <Button>
            Pay Now
          </Button>
        </Container>
      </Container>
    </Section>
  );
}

