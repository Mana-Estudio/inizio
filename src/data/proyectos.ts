import type { ImageMetadata } from 'astro';
import angulo from '../assets/proyectos/angulo.png';
import umbral from '../assets/proyectos/umbral.jpg';
import prisma from '../assets/proyectos/prisma.webp';
import teca from '../assets/proyectos/teca.jpg';
import horizonte from '../assets/proyectos/horizonte.webp';
import cuboDeLuz from '../assets/proyectos/cubo-de-luz.webp';
import galayos from '../assets/proyectos/galayos.png';
import dual from '../assets/proyectos/dual.webp';
import serena from '../assets/proyectos/serena.png';
import nexo from '../assets/proyectos/nexo.png';
import cenit from '../assets/proyectos/cenit.webp';
import zen from '../assets/proyectos/zen.webp';

export type Estado = 'Construida' | 'En obra' | 'En proyecto';
export type Tipo = 'Una planta' | 'Dos plantas' | 'Con sótano';

export interface Proyecto {
  slug: string;
  name: string;
  /** Frase del sitio actual de INIZIO */
  lema: string;
  /** Provisional: pendiente de confirmar con el estudio */
  muni: string;
  estado: Estado;
  tipo: Tipo;
  img: ImageMetadata;
  /** Encuadre de la foto (object-position) */
  pos?: string;
  idx: string;
}

const RAW: Omit<Proyecto, 'idx'>[] = [
  { slug: 'angulo', name: 'Casa Ángulo', lema: 'Vivienda unifamiliar en L que se abre al paisaje y articula la vida alrededor de la luz.', muni: 'Pozuelo de Alarcón', estado: 'Construida', tipo: 'Dos plantas', img: angulo },
  { slug: 'umbral', name: 'Casa Umbral', lema: 'Composición de volúmenes que crean transiciones entre interior y exterior.', muni: 'Majadahonda', estado: 'Construida', tipo: 'Una planta', img: umbral },
  { slug: 'prisma', name: 'Casa Prisma', lema: 'Vivienda unifamiliar de geometría precisa y volúmenes superpuestos.', muni: 'Las Rozas', estado: 'En obra', tipo: 'Dos plantas', img: prisma, pos: '50% 40%' },
  { slug: 'teca', name: 'Casa Teca', lema: 'Refugio de madera donde la vida se vive al aire libre.', muni: 'Pozuelo de Alarcón', estado: 'Construida', tipo: 'Dos plantas', img: teca },
  { slug: 'horizonte', name: 'Casa Horizonte', lema: 'Abierta al paisaje: líneas horizontales y luz natural.', muni: 'Pozuelo de Alarcón', estado: 'Construida', tipo: 'Una planta', img: horizonte, pos: '50% 45%' },
  { slug: 'cubo-de-luz', name: 'Casa Cubo de Luz', lema: 'Un espacio que respira. Geometría y transparencia se unen para bañar cada rincón.', muni: 'Madrid', estado: 'En proyecto', tipo: 'Con sótano', img: cuboDeLuz },
  { slug: 'galayos', name: 'Casa Galayos', lema: 'Volúmenes puros que se alzan con solidez geométrica: un diseño firme y elegante.', muni: 'Ávila', estado: 'Construida', tipo: 'Una planta', img: galayos },
  { slug: 'dual', name: 'Casa Dual', lema: 'Doble volumen en armonía: el contraste define un diseño audaz y atemporal.', muni: 'Las Rozas', estado: 'En obra', tipo: 'Dos plantas', img: dual },
  { slug: 'serena', name: 'Casa Serena', lema: 'Arquitectura tranquila, abierta al jardín y al agua.', muni: 'Majadahonda', estado: 'Construida', tipo: 'Una planta', img: serena },
  { slug: 'nexo', name: 'Casa Nexo', lema: 'Volúmenes que se conectan y se entrelazan para definir el espacio.', muni: 'Pozuelo de Alarcón', estado: 'En proyecto', tipo: 'Con sótano', img: nexo },
  { slug: 'cenit', name: 'Casa Cenit', lema: 'Arquitectura que mira al cielo: luz y altura definen un espacio sereno con vistas.', muni: 'Toledo', estado: 'En obra', tipo: 'Dos plantas', img: cenit },
  { slug: 'zen', name: 'Casa Zen', lema: 'Simplicidad absoluta: volúmenes que crean un espacio de calma.', muni: 'Segovia', estado: 'Construida', tipo: 'Una planta', img: zen },
];

export const PROYECTOS: Proyecto[] = RAW.map((p, i) => ({ ...p, idx: `${String(i + 1).padStart(2, '0')}/12` }));

export const FEATURED = ['teca', 'angulo', 'prisma', 'serena', 'galayos', 'cubo-de-luz'].map(
  (s) => PROYECTOS.find((p) => p.slug === s)!,
);

export const bySlug = (slug: string) => PROYECTOS.find((p) => p.slug === slug)!;

export const CONTACTO = {
  tel: '+34 638 600 367',
  telHref: 'tel:+34638600367',
  email: 'hola@inizio.es',
  wa: 'https://wa.me/34638600367',
  dir: 'Avenida de Europa 26, 2.ª planta',
  cp: '28224 Pozuelo de Alarcón, Madrid',
  horario: 'Lunes a viernes, 9:00–19:00',
};
