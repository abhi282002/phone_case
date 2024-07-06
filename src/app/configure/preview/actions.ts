"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { Order } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
export const createCheckOutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  const session = await auth();
  console.log("hjhj", session);

  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });
  if (!configuration) {
    throw new Error("No such configuration found");
  }

  if (!session?.user) {
    throw new Error("You need to be logged in");
  }
  console.log(session.user.id, configuration.id);

  const { finish, material } = configuration;
  let price = BASE_PRICE;
  if (finish === "textured") {
    price += PRODUCT_PRICES.finish.textured;
  }
  if (material === "polycarbonate") {
    price += PRODUCT_PRICES.material.polycarbonate;
  }
  let order: Order | undefined = undefined;
  const existingOrder = await db.order.findFirst({
    where: {
      userId: session.user.id,
      configurationId: configuration.id,
    },
  });
  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: price / 100,
        userId: session.user?.id || " ",
        configurationId: configuration.id,
      },
    });
  }
  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    },
  });
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["IN", "US", "DE"] },
    metadata: {
      userId: session.user.id || " ",
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });
  return { url: stripeSession.url };
};
