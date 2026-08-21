import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AvailabilitySearch, type AvailCar } from "@/components/AvailabilitySearch";
import { fetchSlotsPublic, fetchBlocksPublic, type BlocksMap } from "@/lib/store";
import type { AdminBooking } from "@/lib/adminBookings";
import type { Loc } from "@/lib/availability";
import { CARS } from "@/routes/cars";

/**
 * Публичный подбор авто: клиент вводит город+даты получения/возврата,
 * видит только реально доступные машины (тот же движок, что в админке).
 * Данные о занятости берутся из Supabase без PII клиентов.
 */
export function PublicCarFinder() {
  const nav = useNavigate();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [blocks, setBlocks] = useState<BlocksMap>({});

  useEffect(() => {
    fetchSlotsPublic().then(setBookings).catch(() => {});
    fetchBlocksPublic().then(setBlocks).catch(() => {});
  }, []);

  const cars: AvailCar[] = CARS.map(c => ({
    slug: c.slug,
    baseCity: c.city as Loc,
    name: c.name,
    priceFrom: c.tiers && c.tiers.length ? c.tiers[c.tiers.length - 1].price : c.price,
    image: c.images?.[0]?.url,
  }));

  return (
    <AvailabilitySearch
      cars={cars}
      bookings={bookings}
      blocks={blocks}
      ctaLabel="Забронировать"
      onPick={(slug) => nav({ to: "/car/$slug", params: { slug } })}
    />
  );
}
