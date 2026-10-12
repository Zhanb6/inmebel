/*
 * Copyright (c) 2025. Sayat Raykul
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
    images: {
    domains: ['api.inmebel.kz'],
  },
};

export default nextConfig;
