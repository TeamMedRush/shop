import { TripInfo } from "@components/kit/trip-info";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { TripData } from "@interfaces/trip-data";
import { useClasses } from "@styles";

export function About() {
  const trips: TripData[] = [
    {
      id: "trip1",
      scale: "small",
      picks: [],
      drop: {
        name: "123 Main St, Springfield",
        latitude: 37.7749,
        longitude: -122.4194,
      },
      payout: {
        amount: 10.00,
        currency: "USD"
      },
      stats: {
        time: 10,
        distance: 5
      }
    }
  ];

  return (
    <Container className={useClasses("about")}>
      <Heading size="max">
        Hello, Agent!
      </Heading>

      <Heading size="medium">
        Pick the delivery you want to make!
      </Heading>

      <Container>
        {trips.map(trip => <TripInfo
          key={trip.id}
          data={trip}
        />)}
      </Container>
    </Container>
  );
}

