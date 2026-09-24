// pages/modules/connection.js
import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ModuleTemplate from "../../components/ModuleTemplate";
import ModuleLocked from "../../components/ModuleLocked";

export default function ConnectionModule() {
  var [state, setState] = useState({ loading: true, config: null, locked: false });

  useEffect(function() {
    var cancelled = false;
    (async function() {
      var sr = await supabase.auth.getSession();
      var session = sr.data.session;
      if (!session || !session.access_token) {
        window.location.href = "/login?redirect=/modules/connection";
        return;
      }
      try {
        var res = await fetch("/api/modules/connection", {
          headers: { Authorization: "Bearer " + session.access_token },
        });
        if (cancelled) return;
        if (res.status === 403) {
          setState({ loading: false, config: null, locked: true });
          return;
        }
        if (!res.ok) {
          setState({ loading: false, config: null, locked: true });
          return;
        }
        var data = await res.json();
        if (cancelled) return;
        setState({ loading: false, config: data.config, locked: false });
      } catch (e) {
        if (!cancelled) setState({ loading: false, config: null, locked: true });
      }
    })();
    return function() { cancelled = true; };
  }, []);

  if (state.loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#021A35" }}>
        <p style={{ color: "#6b7280", fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>Loading…</p>
      </div>
    );
  }

  if (state.locked || !state.config) {
    return (
      <>
        <Head>
        <title>Connection | 5C Leadership Blueprint</title>
        <meta name="description" content="Module 2: Whose are you? Explore identity, belonging, and the relationships that sustain your calling." />
        <meta property="og:title" content="Connection | 5C Leadership Blueprint" />
        <meta property="og:description" content="Module 2: Whose are you? Explore identity, belonging, and the relationships that sustain your calling." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://5cblueprint.awakeningdestiny.global/modules/connection" />
        <meta property="og:site_name" content="5C Leadership Blueprint" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Connection | 5C Leadership Blueprint" />
        <meta name="twitter:description" content="Module 2: Whose are you? Explore identity, belonging, and the relationships that sustain your calling." />
      </Head>
        <ModuleLocked />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Connection | 5C Leadership Blueprint</title>
        <meta name="description" content="Module 2: Whose are you? Explore identity, belonging, and the relationships that sustain your calling." />
        <meta property="og:title" content="Connection | 5C Leadership Blueprint" />
        <meta property="og:description" content="Module 2: Whose are you? Explore identity, belonging, and the relationships that sustain your calling." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://5cblueprint.awakeningdestiny.global/modules/connection" />
        <meta property="og:site_name" content="5C Leadership Blueprint" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Connection | 5C Leadership Blueprint" />
        <meta name="twitter:description" content="Module 2: Whose are you? Explore identity, belonging, and the relationships that sustain your calling." />
      </Head>
      <ModuleTemplate config={state.config} />
    </>
  );
}
