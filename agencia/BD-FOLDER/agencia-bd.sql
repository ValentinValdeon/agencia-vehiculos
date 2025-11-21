-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-11-2025 a las 18:38:16
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `agencia-bd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `domicilio` varchar(255) DEFAULT NULL,
  `localidad` varchar(100) DEFAULT NULL,
  `codigo_postal` int(11) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `nacimiento` date DEFAULT NULL,
  `cuil` varchar(50) DEFAULT NULL,
  `dni` int(11) DEFAULT NULL,
  `tipo_dni` varchar(20) DEFAULT NULL,
  `mail` varchar(100) DEFAULT NULL,
  `estado_civil` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `client`
--

INSERT INTO `client` (`id`, `nombre`, `apellido`, `domicilio`, `localidad`, `codigo_postal`, `provincia`, `telefono`, `nacimiento`, `cuil`, `dni`, `tipo_dni`, `mail`, `estado_civil`, `created_at`) VALUES
(1, 'AGUSTINA', 'STERBA', '9 DE JULIO Y AVELLANEDA', 'GENERAL ALVEAR', 5621, 'MENDOZA', '2625570117', '2001-08-28', '27428618179', 42861817, 'DNI', 'agus.sterba@gmail.com', 'Soltero/a', '2025-11-21 15:09:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago_cheque`
--

CREATE TABLE `pago_cheque` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `banco` varchar(100) DEFAULT NULL,
  `numero_cheque` varchar(50) DEFAULT NULL,
  `monto` decimal(15,2) NOT NULL,
  `fecha_cobro` date DEFAULT NULL,
  `titular` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago_documento`
--

CREATE TABLE `pago_documento` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `monto` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago_financiacion`
--

CREATE TABLE `pago_financiacion` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `entidad_bancaria` varchar(100) DEFAULT NULL,
  `cantidad_cuotas` int(11) DEFAULT NULL,
  `monto_cuota` decimal(15,2) DEFAULT NULL,
  `total_financiado` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago_usado`
--

CREATE TABLE `pago_usado` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `dominio` varchar(20) NOT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `anio` int(11) DEFAULT NULL,
  `cotizacion` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculo`
--

CREATE TABLE `vehiculo` (
  `id` int(11) NOT NULL,
  `condicion` enum('NUEVO','USADO') NOT NULL,
  `marca` varchar(100) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `anio` int(11) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `precio` decimal(15,2) DEFAULT NULL,
  `numero_motor` varchar(100) DEFAULT NULL,
  `numero_chasis` varchar(100) DEFAULT NULL,
  `vin` varchar(100) DEFAULT NULL,
  `dominio` varchar(20) DEFAULT NULL,
  `check_cedula` tinyint(1) DEFAULT 0,
  `check_info_dominio` tinyint(1) DEFAULT 0,
  `check_info_multa` tinyint(1) DEFAULT 0,
  `check_titulo` tinyint(1) DEFAULT 0,
  `check_08` tinyint(1) DEFAULT 0,
  `check_libre_deuda` tinyint(1) DEFAULT 0,
  `check_peritaje` tinyint(1) DEFAULT 0,
  `check_consignacion` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `vehiculo_id` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `precio_total` decimal(15,2) NOT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cuil` (`cuil`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- Indices de la tabla `pago_cheque`
--
ALTER TABLE `pago_cheque`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venta_id` (`venta_id`);

--
-- Indices de la tabla `pago_documento`
--
ALTER TABLE `pago_documento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venta_id` (`venta_id`);

--
-- Indices de la tabla `pago_financiacion`
--
ALTER TABLE `pago_financiacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venta_id` (`venta_id`);

--
-- Indices de la tabla `pago_usado`
--
ALTER TABLE `pago_usado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venta_id` (`venta_id`);

--
-- Indices de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dominio` (`dominio`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`),
  ADD KEY `vehiculo_id` (`vehiculo_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pago_cheque`
--
ALTER TABLE `pago_cheque`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pago_documento`
--
ALTER TABLE `pago_documento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pago_financiacion`
--
ALTER TABLE `pago_financiacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pago_usado`
--
ALTER TABLE `pago_usado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pago_cheque`
--
ALTER TABLE `pago_cheque`
  ADD CONSTRAINT `pago_cheque_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id`);

--
-- Filtros para la tabla `pago_documento`
--
ALTER TABLE `pago_documento`
  ADD CONSTRAINT `pago_documento_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id`);

--
-- Filtros para la tabla `pago_financiacion`
--
ALTER TABLE `pago_financiacion`
  ADD CONSTRAINT `pago_financiacion_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id`);

--
-- Filtros para la tabla `pago_usado`
--
ALTER TABLE `pago_usado`
  ADD CONSTRAINT `pago_usado_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id`);

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `client` (`id`),
  ADD CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculo` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
