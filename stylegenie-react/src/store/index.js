import { create } from "zustand";

const store = create((set, get) => ({
  imageUrl: "http://localhost:8080/image",
  queryUrl: "http://localhost:8080/query",

  mainPrompt: "",
  setMainPrompt: (mainPrompt) => set(() => ({ mainPrompt })),
  resp: null,
  setResp: (resp) => set(() => ({ resp })),
  prompt: "",
  setPrompt: (prompt) => set(() => ({ prompt })),
  gender: "male",
  setGender: (gender) => set(() => ({ gender })),
  withModel: false,
  setWithModel: (withModel) => set(() => ({ withModel })),
  loading: false,
  setLoading: (state) => set(() => ({ loading: state })),
  reviseList: [],
  setReviseList: (reviseList) => set(() => ({ reviseList })),
  queryResp: null,
  setQueryResp: (queryResp) => set(() => ({ queryResp })),
  reviseCount: 0,
  setReviseCount: (reviseCount) => set(() => ({ reviseCount })),


  fetchData: async () => {
    const {
      setLoading,
      setResp,
      setPrompt,
      setMainPrompt,
      resp,
      imageUrl,
      prompt,
      gender,
      withModel,
      reviseList,
      reviseCount,
      setReviseCount,
      mainPrompt,
    } = get();

    if (!prompt || reviseCount >= 11) {
      if (!resp){
        return;
      }
    }

    try {
      setLoading(true);
      if (resp != null && prompt) {
        reviseList.push(prompt);
      } 
      
      if(resp == null && prompt) {
        setMainPrompt(prompt);
      }

      let payload = {
        gender: gender,
        prompt: mainPrompt ? mainPrompt : prompt,
        with_model: withModel,
        revise_list: reviseList,
      };

      const res = await fetch(imageUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (res.status === 400) {
        alert(data.detail);
        return;
      } else if (res.status === 429){
        alert(data.error);
        return;
      }

      setResp(data);
      setLoading(false);
      setPrompt("");
      setReviseCount(reviseCount + 1);
    } catch (e) {
      alert("Something went wrong. Please try again later.");
      setLoading(false);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    }
  },

  fetchQueryData: async () => {
    const { setLoading, setQueryResp, resp, queryUrl, setReviseList, setReviseCount, setPrompt} = get();

    if (!resp) return;

    try {
      setLoading(true);

      let payload = {
        image_url: resp.image_url,
      };

      const res = await fetch(queryUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (res.status === 400) {
        alert(data.detail);
        return;
      } else if (res.status === 429) {
        alert(data.error);
        return;
      }


      setPrompt("");
      setQueryResp(data);
      setReviseList([]);
      setReviseCount(0);
      setLoading(false);
    } catch (e) {
      alert("Something went wrong. Please try again later.");
      setLoading(false);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    }
  },
}));

export default store;
