exports.up = (pgm) => {
  pgm.createTable("sessions", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    token: {
      type: "varchar(96)",
      notNull: true,
      unique: true,
    },
    // user_id sem FK: escolha consciente. Aceitamos sessões órfãs (usuário
    // deletado deixa sessões vivas) para manter sessions desacoplado de users
    // e evitar lock na linha pai a cada login. A limpeza fica a cargo da
    // aplicação; se o problema doer, a FK entra numa migration futura.
    user_id: {
      type: "uuid",
      notNull: true,
    },

    //why timestamp with timezone? https://justatheory.com/2012/04/postgres-use-timestamptz/
    expires_at: {
      type: "timestamptz",
      notNull: true,
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
  });
};

exports.down = false;
