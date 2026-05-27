import { Flash } from "@attaditya/iconoir-preact";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { TripData } from "@interfaces/trip-data";
import { useClasses } from "@styles";

interface TripInfoProps {
  data: TripData;
}

export function TripInfo({ data }: TripInfoProps) {
  return (
    <Container>
      <Container>
        <Flash className={useClasses("trip-info-icon")} />
        <Heading size="medium">
          {data.payout.amount.toFixed(2)} {data.payout.currency}
        </Heading>
      </Container>
    </Container>
  );
}

