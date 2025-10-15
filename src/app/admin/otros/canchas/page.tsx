// app/admin/canchas/page.tsx
"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function CanchasHome() {
    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <h1 className={styles.h1}>Administración de canchas</h1>
                    <p className={styles.h1Sub}>Elegí una acción</p>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.cards}>
                    {/* ALTA */}
                    <Link href="/admin/otros/canchas/alta" className={`${styles.card} ${styles.cardAction}`}>
                        <span className={styles.cardTitle}>Alta cancha</span>
                        <span className={styles.cardDesc}>Crear una nueva cancha</span>
                    </Link>

                    { }
                    <Link href="/admin/otros/canchas/editar" className={styles.card}>
                        <span className={styles.cardTitle}>Editar cancha</span>
                        <span className={styles.cardDesc}>Modificar datos existentes</span>
                    </Link>

                    {/* BAJA */}
                    <Link href="/admin/otros/canchas/baja" className={styles.card}>
                        <span className={styles.cardTitle}>Baja cancha</span>
                        <span className={styles.cardDesc}>Eliminar una cancha</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}